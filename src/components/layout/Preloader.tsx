import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'
import { person } from '../../content/site'
import { QUART } from '../../lib/ease'
import { useScrollLock } from '../../providers/SmoothScroll'

const CUES = ['Sound check', 'House lights', 'Places, please', 'Curtain']
const SEEN_KEY = 'at-curtain-raised'

type Phase = 'loading' | 'opening' | 'done'

const alreadySeen = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * The curtain. Counts the house in while fonts load, then opens as an iris on
 * the stage behind it. Returning visitors in the same tab get the short
 * version, and reduced-motion visitors skip it altogether.
 */
export function Preloader({ onOpen }: { onOpen: () => void }) {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('loading')
  const [count, setCount] = useState(0)
  const iris = useMotionValue(0)

  // A hole in the curtain that grows from the centre of the stage.
  const mask = useTransform(() => {
    const radius = iris.get() * Math.hypot(window.innerWidth, window.innerHeight) * 0.56
    return `radial-gradient(circle at 50% 46%, transparent ${radius}px, #000 ${radius + 2}px)`
  })

  useScrollLock(phase !== 'done')

  useEffect(() => {
    let cancelled = false
    // The show opens on the stage, so a reload starts at the top instead of
    // wherever the browser remembered. A link to a section is followed once
    // the curtain is up.
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    const open = () => {
      if (cancelled) return
      try {
        sessionStorage.setItem(SEEN_KEY, '1')
      } catch {
        // Not fatal: the full intro simply plays again next time.
      }
      setPhase('opening')
      onOpen()
      animate(iris, 1, { duration: reduce ? 0.01 : 1.25, ease: QUART }).then(() => {
        if (cancelled) return
        setPhase('done')
        const linked = window.location.hash.slice(1)
        if (!linked || linked === 'top') return
        // The section may still be mounting; look for it for a couple of seconds.
        const follow = (attempt: number) => {
          const target = document.getElementById(linked)
          if (target) target.scrollIntoView({ block: 'start' })
          else if (attempt < 40 && !cancelled) window.setTimeout(() => follow(attempt + 1), 50)
        }
        follow(0)
      })
    }

    const fontsReady = document.fonts.ready.catch(() => undefined)

    if (reduce || alreadySeen()) {
      fontsReady.then(() => window.setTimeout(open, reduce ? 0 : 250))
      return () => {
        cancelled = true
      }
    }

    const counter = animate(0, 100, {
      duration: 2.1,
      ease: [0.6, 0.05, 0.25, 1],
      onUpdate: (value) => setCount(Math.round(value)),
    })
    Promise.all([counter.finished, fontsReady]).then(() => window.setTimeout(open, 280))

    return () => {
      cancelled = true
      counter.stop()
    }
    // Runs once on mount by design.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (phase === 'done') return null

  const cueIndex = Math.min(CUES.length - 1, Math.floor(count / 25.01))
  const quick = reduce || (count === 0 && phase === 'opening')

  return (
    <motion.div
      className="surface-dark fixed inset-0 z-[95]"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
      role="status"
      aria-label="Loading"
    >
      <motion.div
        className="shell flex h-full flex-col justify-between py-6 md:py-8"
        animate={{ opacity: phase === 'opening' ? 0 : 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="t-label flex justify-between text-muted">
          <span>{person.name}</span>
          <span>Portfolio — Vol. 02</span>
        </div>

        {!quick && (
          <div className="h-[1.3em] overflow-clip text-center text-[clamp(1.75rem,5vw,4.5rem)] leading-[1.3]" aria-hidden>
            <div
              className="transition-transform duration-700 ease-expo will-change-transform"
              style={{ transform: `translateY(${-cueIndex * 1.3}em)` }}
            >
              {CUES.map((cue) => (
                <span key={cue} className="t-serif block">
                  {cue}
                </span>
              ))}
            </div>
          </div>
        )}

        <div aria-hidden>
          <div className="flex items-end justify-between">
            <span className="t-poster text-[clamp(6rem,24vw,22rem)] tabular-nums">
              {String(count).padStart(3, '0')}
            </span>
            <span className="t-label mb-3 text-muted">Curtain in {Math.max(0, 100 - count)}</span>
          </div>
          <div className="mt-3 h-px w-full bg-line">
            <div
              className="h-full origin-left bg-accent will-change-transform"
              style={{ transform: `scaleX(${count / 100})` }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
