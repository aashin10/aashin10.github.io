import { useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

const ROUNDS = [
  { prompt: 'lighthouse', line: 'The keeper had not spoken in a year, so when the lamp went out he assumed it was grief.' },
  { prompt: 'borrowed time', line: 'She returned the hour on a Tuesday, slightly used, with a note that only said thanks.' },
  { prompt: 'static', line: 'Between stations there was a voice, patient as rain, reading out a list of names.' },
]

const SPRINT_SECONDS = 300

const clock = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

/** A writing sprint on loop: a prompt lands, the clock runs, the sentence types itself. */
export function TypewriterViz() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const reduce = useReducedMotion()
  const [round, setRound] = useState(0)
  const [typed, setTyped] = useState(0)

  const current = ROUNDS[round % ROUNDS.length] ?? ROUNDS[0]!
  const full = current.line.length

  useEffect(() => {
    if (!inView || reduce) return undefined
    // Type, hold on the finished line, then clear and move to the next prompt.
    const hold = 46
    const id = window.setInterval(() => {
      setTyped((value) => {
        if (value >= full + hold) {
          setRound((r) => r + 1)
          return 0
        }
        return value + 1
      })
    }, 52)
    return () => window.clearInterval(id)
  }, [inView, reduce, full])

  const shown = reduce ? full : Math.min(typed, full)
  const text = current.line.slice(0, shown)
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const remaining = Math.max(0, SPRINT_SECONDS - Math.round((shown / full) * 74))
  const dash = 2 * Math.PI * 20

  return (
    <div ref={ref} className="flex size-full flex-col gap-5 p-5 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="t-label flex items-center gap-2.5">
          <span className="text-muted">Prompt</span>
          <span key={current.prompt} className="rounded-full bg-accent px-3 py-1.5 text-on-accent">
            {current.prompt}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="t-label tabular-nums">{clock(remaining)}</span>
          <svg viewBox="0 0 48 48" className="size-9 -rotate-90" aria-hidden>
            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" className="text-fg/15" />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={dash}
              strokeDashoffset={dash * (shown / full) * 0.26}
              className="text-accent-text transition-[stroke-dashoffset] duration-200 ease-linear"
            />
          </svg>
        </div>
      </div>

      <div className="relative flex-1 rounded-xl border border-line bg-fg/[0.03] p-5 md:p-7">
        <p className="t-serif text-[clamp(1.35rem,2.5vw,2.3rem)] leading-[1.22]">
          {text}
          <span
            aria-hidden
            className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.14em] animate-[caret_1s_steps(1)_infinite] bg-accent motion-reduce:animate-none"
          />
        </p>
      </div>

      <div className="t-label flex items-center justify-between text-muted">
        <span className="tabular-nums">{String(words).padStart(2, '0')} words</span>
        <span>Deadline beats the blank page</span>
      </div>
    </div>
  )
}
