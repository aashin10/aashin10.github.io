import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useMemo, useRef } from 'react'
import { about, manifesto } from '../../content/site'
import { cn } from '../../lib/cn'
import { EXPO } from '../../lib/ease'
import { Counter } from '../core/Counter'
import { Picture } from '../core/Picture'
import { SectionLabel } from '../core/SectionLabel'
import { Tapes } from './Tapes'

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="surface-invert relative z-10 rounded-t-[1.75rem] md:rounded-t-[3rem]"
    >
      <Tapes />
      <div className="shell pt-36 pb-24 md:pt-52 md:pb-36">
        <SectionLabel index="01" name="The opener" aside="About" />
        <h2 id="about-heading" className="sr-only">
          About Aashin
        </h2>
        <Manifesto />

        <div className="mt-20 grid gap-12 md:mt-32 md:grid-cols-12 md:gap-8">
          <Portrait />
          <div className="md:col-span-6 md:col-start-7 md:pt-6">
            <div className="max-w-[36rem] space-y-5 text-[1.05rem] leading-relaxed text-muted md:text-lg">
              {about.paragraphs.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, transform: 'translateY(24px)' }}
                  whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 1, ease: EXPO, delay: index * 0.1 }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t hairline pt-10 md:mt-20">
              {about.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse gap-2">
                  <dt className="max-w-[14rem] text-sm leading-snug text-muted">{stat.label}</dt>
                  <dd className="t-poster text-[clamp(3.5rem,7.5vw,7rem)]">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

/** The opening statement: each word comes up to full ink as it scrolls past. */
function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.82', 'end 0.5'] })

  const words = useMemo(
    () => manifesto.flatMap((segment) => segment.text.split(' ').map((word) => ({ word, em: segment.em ?? false }))),
    [],
  )

  return (
    <p
      ref={ref}
      className="mt-10 max-w-[22em] text-[clamp(1.85rem,4.5vw,5rem)] leading-[1.06] font-medium tracking-[-0.035em] md:mt-16"
    >
      {words.map(({ word, em }, index) => (
        <Word
          key={index}
          progress={scrollYProgress}
          from={index / words.length}
          to={Math.min(1, (index + 2.5) / words.length)}
          em={em}
          still={Boolean(reduce)}
        >
          {word}
        </Word>
      ))}
    </p>
  )
}

function Word({
  children,
  progress,
  from,
  to,
  em,
  still,
}: {
  children: string
  progress: MotionValue<number>
  from: number
  to: number
  em: boolean
  still: boolean
}) {
  const opacity = useTransform(progress, [from, to], [0.13, 1])
  return (
    <>
      <motion.span
        className={cn(em && 't-serif text-[1.06em] text-accent-text')}
        style={still ? undefined : { opacity }}
      >
        {children}
      </motion.span>{' '}
    </>
  )
}

function Portrait() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])
  // The reveal is watched on the figure, not the clipped box: a box that is
  // fully clipped away never counts as "in view" to the browser.
  const inView = useInView(ref, { once: true, amount: 0.25 })

  return (
    <figure ref={ref} className="md:col-span-5">
      <motion.div
        className="relative aspect-[4/5] overflow-clip rounded-2xl bg-surface md:rounded-3xl"
        initial={false}
        animate={{ clipPath: inView ? 'inset(0% 0% 0% 0% round 1.5rem)' : 'inset(100% 0% 0% 0% round 1.5rem)' }}
        transition={{ duration: 1.3, ease: EXPO }}
      >
        <motion.div className="absolute inset-0 scale-[1.16] will-change-transform" style={reduce ? undefined : { y }}>
          <Picture
            name="host-portrait"
            alt="Aashin Thomas speaking into a podium microphone while hosting an event"
            sizes="(min-width: 768px) 40vw, 92vw"
            className="size-full object-cover object-[50%_22%]"
            eager
          />
        </motion.div>
        <div className="t-label absolute top-4 left-4 flex items-center gap-2 rounded-full bg-ink/70 px-3 py-2 text-paper backdrop-blur-md">
          <span className="size-1.5 animate-[blink_1.6s_ease-in-out_infinite] rounded-full bg-ember motion-reduce:animate-none" />
          On air
        </div>
      </motion.div>
      <figcaption className="t-label mt-4 text-muted">{about.portraitCaption}</figcaption>
    </figure>
  )
}
