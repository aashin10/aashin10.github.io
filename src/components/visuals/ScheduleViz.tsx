import { motion, useInView, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import { seeded } from '../../lib/math'

const LANES = 5
const SLOTS = 26

interface Job {
  id: string
  length: number
  tone: 'ember' | 'paper' | 'line' | 'tungsten'
}

const JOBS: Job[] = [
  { id: 'B-104', length: 6, tone: 'ember' },
  { id: 'B-117', length: 4, tone: 'paper' },
  { id: 'A-031', length: 7, tone: 'line' },
  { id: 'C-220', length: 5, tone: 'tungsten' },
  { id: 'B-121', length: 3, tone: 'paper' },
  { id: 'A-044', length: 8, tone: 'ember' },
  { id: 'D-009', length: 4, tone: 'line' },
  { id: 'C-231', length: 6, tone: 'paper' },
  { id: 'A-052', length: 5, tone: 'tungsten' },
  { id: 'D-015', length: 7, tone: 'line' },
  { id: 'B-130', length: 4, tone: 'ember' },
  { id: 'C-240', length: 3, tone: 'paper' },
]

const TONES: Record<Job['tone'], string> = {
  ember: 'bg-ember text-ink',
  paper: 'bg-paper text-ink',
  tungsten: 'bg-tungsten text-ink',
  line: 'border border-fg/40 text-fg bg-fg/[0.04]',
}

interface Slot {
  lane: number
  start: number
}

/**
 * A scheduler in miniature: take the jobs in a (seeded) random order and drop
 * each into whichever lane lets it start soonest without overlapping, keeping
 * a one-slot changeover between jobs. Every run is a different, valid plan.
 */
function plan(seed: number): Slot[] {
  const random = seeded(seed)
  const order = JOBS.map((_, index) => index).sort(() => random() - 0.5)
  const laneEnds = new Array<number>(LANES).fill(0)
  const result = new Array<Slot>(JOBS.length)

  for (const index of order) {
    const job = JOBS[index]
    if (!job) continue
    let best = 0
    for (let lane = 1; lane < LANES; lane++) {
      if ((laneEnds[lane] ?? 0) < (laneEnds[best] ?? 0)) best = lane
    }
    const start = Math.min(laneEnds[best] ?? 0, SLOTS - job.length)
    result[index] = { lane: best, start }
    laneEnds[best] = start + job.length + 1
  }
  return result
}

/** Looping picture of a production schedule being re-planned. */
export function ScheduleViz() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const reduce = useReducedMotion()
  const [seed, setSeed] = useState(7)
  const [solving, setSolving] = useState(false)
  const slots = useMemo(() => plan(seed), [seed])

  const replan = useCallback(() => {
    setSolving(true)
    window.setTimeout(() => {
      setSeed((value) => value + 1)
      setSolving(false)
    }, 650)
  }, [])

  useEffect(() => {
    if (!inView || reduce) return undefined
    const id = window.setInterval(replan, 3800)
    return () => window.clearInterval(id)
  }, [inView, reduce, replan])

  return (
    <div ref={ref} className="flex size-full flex-col gap-4 p-5 md:p-7">
      <div className="t-label flex items-center justify-between gap-4">
        <span className="text-muted">Line view · Today</span>
        <span className="flex items-center gap-2">
          <span
            className={cn(
              'size-1.5 rounded-full transition-colors duration-300',
              solving ? 'animate-[blink_0.5s_linear_infinite] bg-tungsten' : 'bg-ember',
            )}
          />
          <span className="whitespace-nowrap tabular-nums">
            {solving ? 'Solving…' : 'Feasible'}
            {!solving && <span className="hidden sm:inline"> · 18/18 constraints</span>}
          </span>
        </span>
      </div>

      <div className="relative flex-1">
        {/* Lanes and hour ticks. */}
        <div className="absolute inset-0 grid" style={{ gridTemplateRows: `repeat(${LANES}, 1fr)` }}>
          {Array.from({ length: LANES }, (_, lane) => (
            <div key={lane} className="relative border-t border-dashed border-fg/15">
              <span className="t-label absolute top-1.5 left-0 text-[0.6rem] text-faint">L{lane + 1}</span>
            </div>
          ))}
        </div>
        <div
          className="absolute inset-0 grid opacity-60"
          style={{ gridTemplateColumns: `repeat(${SLOTS / 2}, 1fr)` }}
          aria-hidden
        >
          {Array.from({ length: SLOTS / 2 }, (_, tick) => (
            <div key={tick} className="border-l border-fg/[0.06]" />
          ))}
        </div>

        {/* Jobs: each keeps its size and springs to wherever the new plan puts it. */}
        <div className="absolute inset-0">
          {JOBS.map((job, index) => {
            const slot = slots[index] ?? { lane: 0, start: 0 }
            return (
              <motion.div
                key={job.id}
                layout
                transition={{ type: 'spring', stiffness: 160, damping: 20, mass: 0.9, delay: index * 0.025 }}
                className={cn('t-label absolute flex items-center rounded-md px-2 text-[0.6rem]', TONES[job.tone])}
                style={{
                  left: `${(slot.start / SLOTS) * 100}%`,
                  width: `calc(${(job.length / SLOTS) * 100}% - 3px)`,
                  top: `calc(${(slot.lane / LANES) * 100}% + 26%/${LANES})`,
                  height: `calc(62%/${LANES})`,
                }}
              >
                <span className={cn('whitespace-nowrap', job.length < 6 && 'hidden sm:inline')}>{job.id}</span>
              </motion.div>
            )
          })}
        </div>

        {/* The clock: a line sweeping across the day. */}
        {!reduce && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 will-change-transform"
            animate={inView ? { transform: ['translateX(0%)', 'translateX(100%)'] } : undefined}
            transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
          >
            <div className="absolute inset-y-0 left-0 w-px bg-ember shadow-[0_0_12px_var(--color-ember)]" />
            <div className="t-label absolute -top-1 left-1.5 text-[0.55rem] text-ember">Now</div>
          </motion.div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="t-label text-muted">
          12 jobs · 5 lines<span className="hidden sm:inline"> · 1-slot changeover</span>
        </span>
        <button
          type="button"
          onClick={replan}
          disabled={solving}
          className="t-label group flex shrink-0 items-center gap-2 rounded-full border border-line px-3.5 py-2 whitespace-nowrap transition-colors duration-300 hover:border-fg disabled:opacity-60"
        >
          Re-plan
          <svg viewBox="0 0 16 16" aria-hidden className={cn('size-3', solving && 'animate-spin')}>
            <path
              d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2v3h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
