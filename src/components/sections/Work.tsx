import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { moreWork, projects, type Project, type ProjectVisual } from '../../content/site'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { cn } from '../../lib/cn'
import { Arrow } from '../core/Button'
import { IndexList } from '../core/IndexList'
import { SectionLabel } from '../core/SectionLabel'
import { SplitText } from '../core/SplitText'
import { KanbanViz } from '../visuals/KanbanViz'
import { PhoneViz } from '../visuals/PhoneViz'
import { ScheduleViz } from '../visuals/ScheduleViz'
import { TypewriterViz } from '../visuals/TypewriterViz'

const VISUALS: Record<ProjectVisual, () => React.JSX.Element> = {
  schedule: ScheduleViz,
  kanban: KanbanViz,
  phone: PhoneViz,
  typewriter: TypewriterViz,
}

export function Work() {
  const stackRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const wide = useMediaQuery('(min-width: 1024px)')
  const stacked = wide && !reduce
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start start', 'end end'] })

  return (
    <section id="work" aria-labelledby="work-heading" className="relative z-10 bg-bg text-fg">
      <div className="shell pt-24 md:pt-36">
        <SectionLabel index="02" name="Now showing" aside={`Selected work — 0${projects.length}`} />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 md:mt-12">
          <SplitText
            as="h2"
            by="char"
            text="Now showing"
            id="work-heading"
            className="t-poster text-[clamp(4rem,15.5vw,17rem)]"
          />
          <p className="max-w-[24rem] pb-2 text-muted md:pb-6 md:text-lg">
            Four builds, from a scheduler that runs production plants to an app for settling up with friends. The
            panels are live — poke them.
          </p>
        </div>
      </div>

      <div ref={stackRef} className="shell mt-12 flex flex-col gap-6 pb-10 md:mt-20 lg:block lg:pb-0">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            total={projects.length}
            progress={scrollYProgress}
            stacked={stacked}
          />
        ))}
      </div>

      <div className="shell pt-20 pb-24 md:pt-28 md:pb-36">
        <IndexList heading="Also built" entries={moreWork} cta="Source" />
      </div>
    </section>
  )
}

/**
 * One project. On large screens the cards pin and pile up: as the next card
 * arrives, the one beneath shrinks back a step, like posters pasted over each
 * other. On small screens they simply follow one another.
 */
function ProjectCard({
  project,
  index,
  total,
  progress,
  stacked,
}: {
  project: Project
  index: number
  total: number
  progress: MotionValue<number>
  stacked: boolean
}) {
  const Visual = VISUALS[project.visual]
  const remaining = total - index - 1
  // Card i pins at progress i / (total - 1); the next one has covered it a step
  // later. The last card never gets covered, so it keeps a flat 0..1 range:
  // scroll-linked values run on the browser's scroll timeline, which only
  // accepts offsets inside [0, 1].
  const steps = Math.max(1, total - 1)
  const covered = remaining > 0
  const pinnedAt = index / steps
  const scale = useTransform(progress, covered ? [pinnedAt, 1] : [0, 1], [1, covered ? 1 - remaining * 0.045 : 1])
  const dim = useTransform(
    progress,
    covered ? [(index + 0.4) / steps, (index + 1) / steps] : [0, 1],
    [0, covered ? 0.4 : 0],
  )

  return (
    <div
      className="lg:sticky lg:flex lg:h-svh lg:items-center"
      style={stacked ? { top: `${index * 1.1}rem` } : undefined}
    >
      <motion.article
        aria-labelledby={`${project.id}-title`}
        className={cn(
          project.surface,
          'relative grid w-full origin-top overflow-clip rounded-[1.75rem] border border-line will-change-transform lg:h-[min(44rem,84svh)] lg:grid-cols-12 lg:rounded-[2.25rem]',
        )}
        style={stacked ? { scale } : undefined}
      >
        <div className="flex flex-col p-6 md:p-9 lg:col-span-5 lg:p-10">
          <div className="t-label flex items-center justify-between text-muted">
            <span className="tabular-nums">
              0{index + 1} <span className="text-faint">/ 0{total}</span>
            </span>
            <span>{project.year}</span>
          </div>

          <div className="mt-8 lg:my-auto lg:py-6">
            <p className="t-serif text-[clamp(1.25rem,1.9vw,1.75rem)] text-accent-text">{project.kicker}</p>
            <h3 id={`${project.id}-title`} className="t-poster mt-3 text-[clamp(2.75rem,4.5vw,5rem)]">
              {project.title}
            </h3>
            <p className="mt-5 max-w-[30rem] leading-relaxed text-muted md:text-[1.05rem]">{project.summary}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="t-label rounded-full border border-line px-3 py-2">
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <dl className="mt-8 grid gap-3 border-t hairline pt-5 text-sm lg:mt-0">
            <div className="grid grid-cols-[4.5rem_1fr] gap-3">
              <dt className="t-label pt-0.5 text-muted">Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div className="grid grid-cols-[4.5rem_1fr] gap-3">
              <dt className="t-label pt-0.5 text-muted">Stack</dt>
              <dd>{project.stack.join(' · ')}</dd>
            </div>
            {project.link && (
              <div className="grid grid-cols-[4.5rem_1fr] gap-3">
                <dt className="t-label pt-0.5 text-muted">Link</dt>
                <dd>
                  <a
                    href={project.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 font-semibold underline decoration-line underline-offset-4 transition-colors hover:decoration-current"
                  >
                    {project.link.label}
                    <Arrow className="size-3" />
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="p-3 pt-0 lg:col-span-7 lg:p-4 lg:pl-0">
          <div
            className={cn(
              'relative h-[22rem] overflow-clip rounded-[1.4rem] sm:h-[26rem] lg:h-full lg:rounded-[1.75rem]',
              project.visual === 'phone' ? 'surface-dark' : 'bg-surface',
            )}
          >
            <Visual />
          </div>
        </div>

        {/* Shade that falls over a card once the next one starts covering it. */}
        {stacked && (
          <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-ink" style={{ opacity: dim }} />
        )}
      </motion.article>
    </div>
  )
}
