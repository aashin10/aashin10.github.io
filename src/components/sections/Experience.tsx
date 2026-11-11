import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { certifications, experience } from '../../content/site'
import { EXPO } from '../../lib/ease'
import { IndexList } from '../core/IndexList'
import { SectionLabel } from '../core/SectionLabel'
import { SplitText } from '../core/SplitText'

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.75', 'end 0.55'] })
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 26 })

  return (
    <section id="experience" aria-labelledby="experience-heading" className="relative z-10 bg-bg text-fg">
      <div className="shell pt-24 pb-24 md:pt-36 md:pb-36">
        <SectionLabel index="04" name="The run so far" aside="Experience" />
        <SplitText
          as="h2"
          by="char"
          id="experience-heading"
          text="The run so far"
          className="t-poster mt-8 text-[clamp(3.4rem,12.5vw,14rem)] md:mt-12"
        />

        <ol ref={listRef} className="relative mt-14 md:mt-24">
          {/* The through-line, drawn as the list scrolls past. */}
          <span aria-hidden className="absolute top-0 bottom-0 left-0 w-px bg-line md:left-[calc(25%-1px)]">
            <motion.span
              className="absolute inset-0 origin-top bg-accent will-change-transform"
              style={{ scaleY: reduce ? 1 : line }}
            />
          </span>

          {experience.map((item, index) => (
            <motion.li
              key={item.title}
              className="group relative grid gap-x-8 gap-y-3 py-9 pl-7 md:grid-cols-12 md:py-14 md:pl-0"
              initial={{ opacity: 0, transform: 'translateY(40px)' }}
              whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 1.1, ease: EXPO }}
            >
              <span
                aria-hidden
                className="absolute top-[2.9rem] left-0 size-2.5 -translate-x-[4.5px] rounded-full border border-accent bg-bg transition-colors duration-500 group-hover:bg-accent md:top-[4.4rem] md:left-[calc(25%-1px)]"
              />
              <p className="t-label pt-1.5 text-muted md:col-span-3 md:pr-8">{item.period}</p>
              <div className="md:col-span-9 md:pl-12">
                <h3 className="t-wide text-[clamp(1.5rem,3.4vw,3.2rem)]">{item.title}</h3>
                <p className="t-serif mt-2 text-[clamp(1.15rem,1.8vw,1.6rem)] text-accent-text">{item.place}</p>
                <ul className="mt-5 max-w-[46rem] space-y-2.5 text-muted md:text-[1.05rem]">
                  {item.points.map((point) => (
                    <li key={point} className="relative pl-5 leading-relaxed">
                      <span aria-hidden className="absolute top-[0.72em] left-0 h-px w-2.5 bg-faint" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              {index < experience.length - 1 && (
                <span aria-hidden className="absolute right-0 bottom-0 left-7 h-px bg-line md:left-[25%]" />
              )}
            </motion.li>
          ))}
        </ol>

        <div className="mt-20 md:mt-28">
          <IndexList heading="Certifications" entries={certifications} cta="Verify" />
        </div>
      </div>
    </section>
  )
}
