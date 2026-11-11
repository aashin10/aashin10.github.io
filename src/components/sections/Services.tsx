import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { services } from '../../content/site'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { cn } from '../../lib/cn'
import { EXPO } from '../../lib/ease'
import { SectionLabel } from '../core/SectionLabel'
import { SplitText } from '../core/SplitText'

export function Services() {
  const [open, setOpen] = useState(0)

  return (
    <section id="services" aria-labelledby="services-heading" className="surface-invert relative z-10">
      <div className="shell pt-24 pb-20 md:pt-36 md:pb-28">
        <SectionLabel index="03" name="The programme" aside="Services" />
        <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-12">
          <SplitText
            as="h2"
            by="char"
            id="services-heading"
            text="What I do"
            className="t-poster text-[clamp(4rem,13vw,14rem)] md:col-span-8"
          />
          <p className="self-end text-muted md:col-span-4 md:pb-5 md:text-lg">{services.intro}</p>
        </div>

        <div className="mt-12 border-t hairline md:mt-20">
          {services.items.map((item, index) => {
            const expanded = open === index
            return (
              <div key={item.title} className="border-b hairline">
                <h3>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`service-${index}`}
                    onClick={() => setOpen(expanded ? -1 : index)}
                    className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-6 text-left md:grid-cols-[6rem_minmax(0,6fr)_minmax(0,5fr)_auto] md:gap-6 md:py-9"
                  >
                    <span className="t-label text-muted tabular-nums">0{index + 1}</span>
                    <span
                      className={cn(
                        't-wide text-[clamp(1.6rem,4.4vw,4.2rem)] transition-[color,transform] duration-500 ease-expo motion-reduce:transition-none',
                        expanded ? 'text-accent-text' : 'group-hover:translate-x-3',
                      )}
                    >
                      {item.title}
                    </span>
                    <span className="t-serif hidden text-[clamp(1.2rem,1.9vw,1.75rem)] text-muted md:block">{item.line}</span>
                    <span
                      aria-hidden
                      className={cn(
                        'relative grid size-10 place-items-center rounded-full border border-line transition-[background-color,color,transform] duration-500 ease-expo md:size-14',
                        expanded ? 'rotate-45 bg-fg text-bg' : 'group-hover:bg-fg group-hover:text-bg',
                      )}
                    >
                      <span className="absolute h-px w-4 bg-current" />
                      <span className="absolute h-4 w-px bg-current" />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      id={`service-${index}`}
                      role="region"
                      aria-label={item.title}
                      className="overflow-clip"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.7, ease: EXPO }}
                    >
                      <div className="grid gap-6 pb-9 md:grid-cols-[6rem_minmax(0,6fr)_minmax(0,5fr)_auto] md:gap-6 md:pb-12">
                        <span className="hidden md:block" />
                        <p className="max-w-[34rem] text-[1.05rem] leading-relaxed text-muted md:text-lg">
                          <span className="t-serif mb-2 block text-[1.2em] text-fg md:hidden">{item.line}</span>
                          {item.body}
                        </p>
                        <ul className="grid gap-2 self-start sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
                          {item.points.map((point, pointIndex) => (
                            <motion.li
                              key={point}
                              className="t-label flex items-center gap-2.5"
                              initial={{ opacity: 0, transform: 'translateX(-10px)' }}
                              animate={{ opacity: 1, transform: 'translateX(0px)' }}
                              transition={{ duration: 0.6, ease: EXPO, delay: 0.15 + pointIndex * 0.06 }}
                            >
                              <span className="size-1.5 shrink-0 rounded-full bg-accent" />
                              {point}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      <Process />
    </section>
  )
}

/**
 * "Running order": the steps of a project as a strip of cards. On large
 * screens the section pins and vertical scrolling drives the strip sideways;
 * on small screens (or with reduced motion) it is an ordinary swipeable row.
 */
function Process() {
  const reduce = useReducedMotion()
  const wide = useMediaQuery('(min-width: 1024px)')
  const pinned = wide && !reduce

  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLOListElement>(null)
  const [travel, setTravel] = useState(0)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel])
  const bar = useTransform(scrollYProgress, [0, 1], [0.04, 1])

  useEffect(() => {
    const track = trackRef.current
    if (!track || !pinned) return undefined
    const measure = () => setTravel(Math.max(0, track.scrollWidth - track.clientWidth))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => observer.disconnect()
  }, [pinned])

  const steps = services.process

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={pinned ? { height: `calc(100svh + ${travel}px)` } : undefined}
    >
      <div className={cn('flex flex-col justify-center overflow-clip pb-20 md:pb-28', pinned && 'sticky top-0 h-svh pb-0')}>
        <div className="shell flex items-end justify-between gap-6">
          <h3 className="t-poster text-[clamp(2.5rem,6vw,5.5rem)]">{services.processTitle}</h3>
          <span className="t-label hidden pb-2 text-muted sm:block">
            {pinned ? 'Keep scrolling' : 'Swipe'} · 0{steps.length} steps
          </span>
        </div>

        <motion.ol
          ref={trackRef}
          className={cn(
            'mt-8 flex gap-4 px-[clamp(1.25rem,4vw,4rem)] md:mt-12 md:gap-5',
            pinned ? 'will-change-transform' : 'snap-x snap-mandatory overflow-x-auto pb-4 [scrollbar-width:none]',
          )}
          style={pinned ? { x } : undefined}
        >
          {steps.map((step, index) => (
            <li
              key={step.step}
              className="group relative flex h-[19rem] w-[78vw] shrink-0 snap-start flex-col justify-between rounded-3xl border border-line bg-surface p-6 transition-colors duration-500 hover:bg-accent hover:text-on-accent sm:w-[24rem] md:h-[22rem] md:p-8 lg:h-[min(27rem,50svh)] lg:w-[27rem]"
            >
              <div className="flex items-start justify-between">
                <span className="t-poster text-[5rem] leading-none text-accent-text transition-colors duration-500 group-hover:text-on-accent md:text-[7rem]">
                  0{index + 1}
                </span>
                <span className="t-label mt-2 text-muted transition-colors duration-500 group-hover:text-on-accent">
                  {index === steps.length - 1 ? 'Curtain' : 'Cue'}
                </span>
              </div>
              <div>
                <h4 className="t-wide text-[1.6rem] md:text-[1.9rem]">{step.step}</h4>
                <p className="mt-3 max-w-[22rem] leading-relaxed text-muted transition-colors duration-500 group-hover:text-on-accent">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </motion.ol>

        {pinned && (
          <div className="shell mt-10">
            <div className="h-px w-full bg-line">
              <motion.div className="h-full origin-left bg-accent will-change-transform" style={{ scaleX: bar }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
