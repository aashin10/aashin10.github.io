import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { wrap } from '../../lib/math'

/**
 * Endless ticker. It drifts on its own, speeds up with the page scroll and
 * turns around when you scroll the other way.
 */
export function Marquee({
  children,
  speed = 3,
  direction = 1,
  repeat = 4,
  className,
}: {
  children: ReactNode
  /** Resting speed, in percent of one copy per second. */
  speed?: number
  direction?: 1 | -1
  /** Copies per half; raise it if a short phrase leaves gaps on wide screens. */
  repeat?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '200px 0px' })

  const offset = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 300 })
  const boost = useTransform(smoothVelocity, [-2000, 0, 2000], [-6, 0, 6], { clamp: false })
  const heading = useRef<number>(direction)

  // The track holds two identical halves, so sliding by 50% loops seamlessly.
  const x = useTransform(() => `${wrap(-50, 0, offset.get())}%`)

  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return
    const push = boost.get()
    if (push < -0.1) heading.current = -direction
    else if (push > 0.1) heading.current = direction
    const step = (speed / repeat) * (delta / 1000) * (1 + Math.abs(push))
    offset.set(offset.get() - heading.current * step)
  })

  const half = Array.from({ length: repeat }, (_, index) => (
    <div key={index} className="flex shrink-0 items-center">
      {children}
    </div>
  ))

  return (
    <div ref={ref} className={cn('flex overflow-clip', className)} aria-hidden>
      <motion.div className="flex shrink-0 will-change-transform" style={{ x }}>
        <div className="flex shrink-0">{half}</div>
        <div className="flex shrink-0">{half}</div>
      </motion.div>
    </div>
  )
}
