import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'

/** Counts up to `value` the first time it scrolls into view. */
export function Counter({ value, suffix = '', className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node || !inView) return undefined
    if (reduce) {
      node.textContent = String(value)
      return undefined
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = String(Math.round(latest))
      },
    })
    return () => controls.stop()
  }, [inView, reduce, value])

  return (
    <span className={className}>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
      <span aria-hidden>
        <span ref={ref} className="tabular-nums">
          0
        </span>
        {suffix}
      </span>
    </span>
  )
}
