import {
  animate,
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { hero, person } from '../../content/site'
import { useFinePointer } from '../../hooks/useMediaQuery'
import { EXPO } from '../../lib/ease'
import { lerp, smoothstep } from '../../lib/math'
import { useCurtainUp } from '../../providers/Stage'
import { useScrollTo } from '../../providers/SmoothScroll'
import { Arrow, ButtonLink } from '../core/Button'
import { Clock } from '../core/Clock'
import { Magnetic } from '../core/Magnetic'
import { SplitText } from '../core/SplitText'
import { SpotlightCanvas } from '../visuals/SpotlightCanvas'

const LINES = [person.first, person.last]
const LETTER_COUNT = LINES.join('').length

// Archivo's width axis: 62 is its narrowest cut. Letters under the spot open
// up toward MAX_WIDTH, so the name seems to breathe where the light lands.
const BASE_WIDTH = 62
const MAX_WIDTH = 118
const MAX_WIDTH_TOUCH = 90
/** How long the pointer rests before the spot goes back to sweeping by itself. */
const IDLE_AFTER_MS = 2600

interface Geometry {
  /** Hero section size. */
  width: number
  height: number
  /** Name block position inside the section. */
  nameLeft: number
  nameTop: number
  nameWidth: number
  nameHeight: number
  /** Resting centre of every letter, relative to the name block. */
  centers: Float32Array
  /** Reach of the kinetic effect in px. */
  reach: number
}

export function Hero() {
  const curtainUp = useCurtainUp()
  const reduce = useReducedMotion()
  const fine = useFinePointer()
  const scrollTo = useScrollTo()

  const sectionRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const rulerRef = useRef<HTMLSpanElement>(null)
  const geometry = useRef<Geometry | null>(null)
  const letters = useRef<HTMLElement[]>([])
  const widths = useRef(new Float32Array(LETTER_COUNT).fill(BASE_WIDTH))
  const pointer = useRef({ x: 0, y: 0, movedAt: -Infinity })
  const autoBlend = useRef(1)

  // Where the spot is aimed (raw) and where the lamp has caught up to (sprung).
  const aimX = useMotionValue(0)
  const aimY = useMotionValue(0)
  const spotX = useSpring(aimX, { stiffness: 55, damping: 14, mass: 1 })
  const spotY = useSpring(aimY, { stiffness: 55, damping: 14, mass: 1 })
  const power = useMotionValue(0)

  const [viewportHeight, setViewportHeight] = useState(() => window.innerHeight)
  const { scrollY } = useScroll()
  const [onStage, setOnStage] = useState(true)

  // Exit: the stage sinks back and dims as the next section slides over it.
  const exitScale = useTransform(scrollY, [0, viewportHeight], [1, 0.9])
  const exitY = useTransform(scrollY, [0, viewportHeight], [0, -viewportHeight * 0.08])
  const exitOpacity = useTransform(scrollY, [0, viewportHeight * 0.85], [1, 0])

  useEffect(() => scrollY.on('change', (value) => setOnStage(value < window.innerHeight * 1.05)), [scrollY])

  // Measure once the type has loaded, and again whenever the layout changes.
  useEffect(() => {
    const section = sectionRef.current
    const name = nameRef.current
    const ruler = rulerRef.current
    if (!section || !name || !ruler) return undefined

    letters.current = Array.from(name.querySelectorAll<HTMLElement>('[data-letter]'))

    const measure = () => {
      const sectionBox = section.getBoundingClientRect()
      const nameBox = name.getBoundingClientRect()
      const marks = ruler.querySelectorAll<HTMLElement>('[data-mark]')
      const centers = new Float32Array(marks.length * 2)
      marks.forEach((mark, index) => {
        const box = mark.getBoundingClientRect()
        centers[index * 2] = box.left + box.width / 2 - nameBox.left
        centers[index * 2 + 1] = box.top + box.height / 2 - nameBox.top
      })
      geometry.current = {
        width: sectionBox.width,
        height: sectionBox.height,
        nameLeft: nameBox.left - sectionBox.left,
        nameTop: nameBox.top - sectionBox.top,
        nameWidth: nameBox.width,
        nameHeight: nameBox.height,
        centers,
        reach: parseFloat(getComputedStyle(name).fontSize) * 1.05,
      }
      setViewportHeight(window.innerHeight)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(section)
    document.fonts.ready.then(measure).catch(() => undefined)
    return () => observer.disconnect()
  }, [])

  // Lamp strike: a couple of flickers, then it holds.
  useEffect(() => {
    if (!curtainUp) return undefined
    const controls = reduce
      ? animate(power, 1, { duration: 0.01 })
      : animate(power, [0, 0.85, 0.25, 1, 0.8, 1], {
          duration: 1.5,
          times: [0, 0.12, 0.2, 0.34, 0.46, 1],
          ease: 'easeOut',
          delay: 0.15,
        })
    return () => controls.stop()
  }, [curtainUp, reduce, power])

  useEffect(() => {
    if (!fine) return undefined
    const onMove = (event: PointerEvent) => {
      const section = sectionRef.current
      if (!section || event.pointerType !== 'mouse') return
      const box = section.getBoundingClientRect()
      pointer.current.x = event.clientX - box.left
      pointer.current.y = event.clientY - box.top
      pointer.current.movedAt = performance.now()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [fine])

  useAnimationFrame((time) => {
    const g = geometry.current
    const name = nameRef.current
    if (!g || !name || !onStage) return

    // Unattended, the operator sweeps the spot back and forth across the name.
    const sweepX = g.nameLeft + g.nameWidth * (0.5 + 0.44 * Math.sin(time * 0.00043))
    const sweepY = g.nameTop + g.nameHeight * (0.5 + 0.3 * Math.sin(time * 0.00071 + 1.2))
    const idle = reduce || performance.now() - pointer.current.movedAt > IDLE_AFTER_MS
    autoBlend.current = lerp(autoBlend.current, idle ? 1 : 0, 0.06)

    if (reduce) {
      aimX.jump(g.nameLeft + g.nameWidth * 0.5)
      aimY.jump(g.nameTop + g.nameHeight * 0.5)
    } else {
      aimX.set(lerp(pointer.current.x, sweepX, autoBlend.current))
      aimY.set(lerp(pointer.current.y, sweepY, autoBlend.current))
    }

    // Hand the lit layer its mask position, in the name block's own coordinates.
    const localX = spotX.get() - g.nameLeft
    const localY = spotY.get() - g.nameTop
    name.style.setProperty('--sx', `${localX.toFixed(1)}px`)
    name.style.setProperty('--sy', `${localY.toFixed(1)}px`)

    if (reduce) return

    // Open up the letters nearest the light. Each layer holds one copy of the
    // name, so letter i of every layer shares the same target width.
    const maxWidth = fine ? MAX_WIDTH : MAX_WIDTH_TOUCH
    const lit = power.get()
    const all = letters.current
    const layers = all.length / LETTER_COUNT
    for (let i = 0; i < LETTER_COUNT; i++) {
      const dx = (g.centers[i * 2] ?? 0) - localX
      const dy = (g.centers[i * 2 + 1] ?? 0) - localY
      const near = 1 - smoothstep(0, g.reach, Math.sqrt(dx * dx + dy * dy))
      const target = BASE_WIDTH + (maxWidth - BASE_WIDTH) * near * lit
      const current = widths.current[i] ?? BASE_WIDTH
      if (Math.abs(target - current) < 0.2) continue
      widths.current[i] = target
      const value = target.toFixed(1)
      for (let layer = 0; layer < layers; layer++) {
        all[layer * LETTER_COUNT + i]?.style.setProperty('--wdth', value)
      }
    }
  })

  const goTo = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault()
    scrollTo(id)
  }

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label="Introduction"
      className="surface-dark sticky top-0 isolate h-svh min-h-[40rem] overflow-clip"
    >
      {/* CSS stand-in for the stage lighting if WebGL is unavailable. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60vmax_circle_at_35%_45%,rgb(255_207_153/0.16),transparent_62%)]"
      />
      <SpotlightCanvas
        spotX={spotX}
        spotY={spotY}
        power={power}
        active={onStage}
        className="absolute inset-0 size-full data-[ready=false]:hidden"
      />

      <motion.div
        className="shell relative z-10 flex h-full flex-col pt-24 pb-6 will-change-transform md:pt-28 md:pb-8"
        style={reduce ? undefined : { scale: exitScale, y: exitY, opacity: exitOpacity }}
      >
        <div className="t-label flex items-center justify-between gap-6 text-muted">
          <FadeIn show={curtainUp} delay={0.9}>
            Portfolio — Vol. 02
          </FadeIn>
          <FadeIn show={curtainUp} delay={1} className="hidden sm:block">
            {person.location} · <Clock />
          </FadeIn>
        </div>

        <div className="my-auto grid gap-7 py-5 xl:grid-cols-[auto_minmax(0,1fr)] xl:items-stretch xl:gap-0">
          <div className="relative w-fit">
            <h1
              ref={nameRef}
              className="t-poster relative w-fit text-[min(26vw,30svh)] select-none xl:text-[min(17.5vw,40svh)]"
              style={{ '--sx': '50%', '--sy': '50%' } as CSSProperties}
            >
              <span className="sr-only">{person.name}</span>
              {/* Ruler: an invisible copy that never changes width. It gives the
                  block its size and is what the letter positions are measured from,
                  so the kinetic layers on top can stretch without reflowing the page. */}
              <span ref={rulerRef} aria-hidden className="invisible block">
                <NameLines marker="data-mark" />
              </span>
              {/* Unlit name. */}
              <span aria-hidden className="absolute top-0 left-0 block w-[140%] text-fg/[0.13]">
                <NameLines marker="data-letter" show={curtainUp} />
              </span>
              {/* Lit name, visible only inside the pool of light. */}
              <span
                aria-hidden
                className="absolute top-0 left-0 block w-[140%] text-paper [mask-image:radial-gradient(var(--spot-size)_circle_at_var(--sx)_var(--sy),#000_22%,transparent_100%)] motion-reduce:[mask-image:none]"
                style={{ '--spot-size': 'min(34vw, 26rem)' } as CSSProperties}
              >
                <NameLines marker="data-letter" show={curtainUp} />
              </span>
            </h1>

            <FadeIn show={curtainUp} delay={1.3} className="absolute -right-3 -bottom-9 hidden md:block xl:-right-[9%] xl:-bottom-[7%]">
              <Badge onClick={goTo('contact')} />
            </FadeIn>
          </div>

          {/* Beside the name on wide screens, under it everywhere else. */}
          <div className="flex flex-col gap-6 xl:ml-auto xl:w-[min(100%,22rem)] xl:justify-between xl:gap-8 2xl:w-[min(100%,27rem)]">
            <div className="flex items-end justify-between gap-4">
              <FadeIn show={curtainUp} delay={1.1}>
                <p className="t-label mb-2 text-muted">Now playing</p>
                <RoleTicker start={curtainUp} />
              </FadeIn>
              <FadeIn show={curtainUp} delay={1.3} className="-my-4 shrink-0 md:hidden">
                <Badge onClick={goTo('contact')} />
              </FadeIn>
            </div>

            <div>
              <p className="text-[clamp(1.7rem,3.4vw,3.4rem)] leading-[1.02] font-medium tracking-[-0.03em] xl:text-[clamp(2.2rem,3.1vw,3.6rem)]">
                <SplitText text={hero.tagline[0]} show={curtainUp} delay={1.05} className="block" />
                <SplitText
                  text={hero.tagline[1]}
                  show={curtainUp}
                  delay={1.2}
                  className="t-serif block text-[1.08em] text-accent-text"
                />
              </p>
              <FadeIn show={curtainUp} delay={1.35} className="mt-5 xl:mt-7">
                <p className="max-w-[34rem] text-[0.98rem] leading-relaxed text-muted">{hero.intro}</p>
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <ButtonLink href="#contact" onClick={goTo('contact')}>
                    {hero.primaryCta}
                    <Arrow />
                  </ButtonLink>
                  <a href="#work" onClick={goTo('work')} className="group inline-flex items-center gap-2.5 py-2 text-[0.95rem] font-semibold">
                    <span className="relative">
                      {hero.secondaryCta}
                      <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-fg transition-transform duration-500 ease-expo group-hover:origin-left group-hover:scale-x-100" />
                    </span>
                    <Arrow down />
                  </a>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

/** The name as two lines of individually addressable letters. */
function NameLines({ marker, show = true }: { marker: 'data-letter' | 'data-mark'; show?: boolean }) {
  let index = 0
  return (
    <>
      {LINES.map((line) => (
        <span key={line} className="block overflow-x-visible overflow-y-clip whitespace-nowrap">
          {Array.from(line).map((char) => {
            const i = index++
            return (
              <span
                key={i}
                {...{ [marker]: '' }}
                className="inline-block transition-transform duration-[1100ms] ease-expo will-change-transform motion-reduce:transition-none"
                style={{
                  transform: show ? 'translateY(0)' : 'translateY(108%)',
                  transitionDelay: `${0.25 + i * 0.045}s`,
                  fontVariationSettings: `'wdth' var(--wdth, ${BASE_WIDTH}), 'wght' 900`,
                }}
              >
                {char}
              </span>
            )
          })}
        </span>
      ))}
    </>
  )
}

/** Rotating "available" seal that links to the contact section. */
function Badge({ onClick }: { onClick: (event: React.MouseEvent) => void }) {
  const ringId = useId()
  return (
    <Magnetic strength={0.25}>
      <a
        href="#contact"
        onClick={onClick}
        aria-label="Available for freelance — get in touch"
        className="group relative grid size-28 place-items-center rounded-full xl:size-36"
      >
        <svg
          viewBox="0 0 200 200"
          aria-hidden
          className="absolute inset-0 size-full animate-[spin-slow_18s_linear_infinite] motion-reduce:animate-none"
        >
          <defs>
            <path id={ringId} d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
          </defs>
          <text className="t-label fill-fg" style={{ fontSize: 15 }} textLength="496" lengthAdjust="spacing">
            <textPath href={`#${ringId}`} textLength="496" lengthAdjust="spacing">
              {hero.badge}
            </textPath>
          </text>
        </svg>
        <span className="grid size-12 place-items-center rounded-full bg-accent text-on-accent transition-transform duration-500 ease-expo group-hover:scale-125 xl:size-14">
          <Arrow className="size-4" />
        </span>
      </a>
    </Magnetic>
  )
}

function FadeIn({
  show,
  delay = 0,
  className,
  children,
}: {
  show: boolean
  delay?: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      className={className}
      initial={false}
      animate={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0px)' : 'translateY(18px)' }}
      transition={{ duration: 1, ease: EXPO, delay: show ? delay : 0 }}
    >
      {children}
    </motion.div>
  )
}

/** Cycles through what he does, one role flipping up over the last. */
function RoleTicker({ start }: { start: boolean }) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!start || reduce) return undefined
    const id = window.setInterval(() => setIndex((value) => (value + 1) % hero.roles.length), 2400)
    return () => window.clearInterval(id)
  }, [start, reduce])

  return (
    <span className="relative block h-[1.25em] overflow-clip text-[clamp(1.25rem,2vw,1.9rem)] leading-tight font-semibold tracking-tight">
      <span className="sr-only">{hero.roles.join(', ')}</span>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={index}
          aria-hidden
          className="block whitespace-nowrap"
          initial={{ transform: 'translateY(105%)' }}
          animate={{ transform: 'translateY(0%)' }}
          exit={{ transform: 'translateY(-105%)' }}
          transition={{ duration: 0.7, ease: EXPO }}
        >
          {hero.roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
