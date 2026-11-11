import { LayoutGroup, motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/cn'

const COLUMNS = ['Backlog', 'In sprint', 'Done'] as const

interface Ticket {
  id: string
  title: string
  tone: string
}

const TICKETS: Ticket[] = [
  { id: 'PMT-41', title: 'Sprint board', tone: 'bg-ember' },
  { id: 'PMT-42', title: 'AI sprint planner', tone: 'bg-ink' },
  { id: 'PMT-43', title: 'Backlog view', tone: 'bg-ink/40' },
  { id: 'PMT-44', title: 'Burndown report', tone: 'bg-ember' },
  { id: 'PMT-45', title: 'Teams chat hook', tone: 'bg-ink/40' },
  { id: 'PMT-46', title: 'Role permissions', tone: 'bg-ink' },
]

const START = [2, 1, 1, 0, 0, 0]

/** Looping sprint board: tickets work their way across, then the sprint resets. */
export function KanbanViz() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const reduce = useReducedMotion()
  const [columns, setColumns] = useState(START)
  const [picked, setPicked] = useState<number | null>(null)

  useEffect(() => {
    if (!inView || reduce) return undefined
    let timeout = 0
    const id = window.setInterval(() => {
      setColumns((current) => {
        // The "planner" picks the ticket furthest along that can still move.
        let candidate = -1
        for (let i = 0; i < current.length; i++) {
          const column = current[i] ?? 0
          if (column < 2 && (candidate === -1 || column >= (current[candidate] ?? 0))) candidate = i
        }
        if (candidate === -1) {
          setPicked(null)
          return START
        }
        setPicked(candidate)
        timeout = window.setTimeout(() => setPicked(null), 900)
        return current.map((column, index) => (index === candidate ? column + 1 : column))
      })
    }, 1700)
    return () => {
      window.clearInterval(id)
      window.clearTimeout(timeout)
    }
  }, [inView, reduce])

  const done = columns.filter((column) => column === 2).length
  const progress = Math.round((done / TICKETS.length) * 100)

  return (
    <div ref={ref} className="flex size-full flex-col gap-4 p-4 sm:p-5 md:p-7">
      <div className="t-label flex items-center justify-between gap-4">
        <span className="text-muted">Sprint 12 · Board</span>
        <span className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5">
          <svg viewBox="0 0 16 16" aria-hidden className={cn('size-3 text-accent-text', picked !== null && 'animate-spin')}>
            <path d="M8 0l1.6 6.4L16 8l-6.4 1.6L8 16l-1.6-6.4L0 8l6.4-1.6Z" fill="currentColor" />
          </svg>
          AI planner
        </span>
      </div>

      <LayoutGroup>
        <div className="grid flex-1 grid-cols-3 gap-2.5 md:gap-3">
          {COLUMNS.map((name, columnIndex) => (
            <div key={name} className="flex min-h-0 flex-col rounded-xl bg-fg/[0.05] p-2 md:p-2.5">
              <div className="t-label mb-2 flex items-center justify-between gap-1 px-1 text-[0.55rem] whitespace-nowrap text-muted sm:text-[0.6rem]">
                <span>{name}</span>
                <span className="tabular-nums">{columns.filter((column) => column === columnIndex).length}</span>
              </div>
              <div className="flex flex-col gap-2">
                {TICKETS.map((ticket, index) =>
                  columns[index] === columnIndex ? (
                    <motion.div
                      key={ticket.id}
                      layoutId={ticket.id}
                      layout
                      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                      className={cn(
                        'rounded-lg border bg-bg p-2 shadow-[0_1px_0_rgb(0_0_0/0.06)] transition-[border-color,box-shadow] duration-300 sm:p-2.5',
                        picked === index ? 'border-accent shadow-[0_0_0_3px_rgb(255_77_33/0.18)]' : 'border-line',
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn('h-1.5 w-6 shrink-0 rounded-full sm:w-7', ticket.tone)} />
                        <span className="t-label hidden text-[0.55rem] whitespace-nowrap text-faint sm:inline">
                          {ticket.id}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[0.68rem] leading-[1.15] font-semibold sm:mt-2 sm:text-[0.8rem]">
                        {ticket.title}
                      </p>
                      <div className="mt-2.5 hidden items-center justify-between sm:flex">
                        <span className="h-1 w-10 rounded-full bg-fg/10" />
                        <span className="size-4 rounded-full bg-fg/15" />
                      </div>
                    </motion.div>
                  ) : null,
                )}
              </div>
            </div>
          ))}
        </div>
      </LayoutGroup>

      <div className="flex items-center gap-4">
        <span className="t-label shrink-0 text-muted">Sprint progress</span>
        <span className="relative h-1.5 flex-1 overflow-clip rounded-full bg-fg/10">
          <span
            className="absolute inset-0 origin-left rounded-full bg-accent transition-transform duration-700 ease-expo"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </span>
        <span className="t-label w-9 text-right tabular-nums">{progress}%</span>
      </div>
    </div>
  )
}
