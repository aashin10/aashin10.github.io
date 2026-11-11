import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useRef, type PointerEvent, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

const SPRING = { stiffness: 240, damping: 15, mass: 0.6 }

/**
 * Pulls its child toward the pointer while hovered and springs it back on
 * leave. Mouse only: touch has no hover to pull from.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode
  /** Fraction of the pointer offset the child travels. */
  strength?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const bounds = useRef<DOMRect | null>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, SPRING)
  const y = useSpring(rawY, SPRING)

  const onEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || reduce) return
    // Measured once per hover, not per move, to keep layout reads off the hot path.
    bounds.current = event.currentTarget.getBoundingClientRect()
  }
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = bounds.current
    if (!rect) return
    rawX.set((event.clientX - (rect.left + rect.width / 2)) * strength)
    rawY.set((event.clientY - (rect.top + rect.height / 2)) * strength)
  }
  const onLeave = () => {
    bounds.current = null
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.div
      className={cn('inline-block will-change-transform', className)}
      style={{ x, y }}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  )
}
