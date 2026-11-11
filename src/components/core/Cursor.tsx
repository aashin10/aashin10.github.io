import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { useFinePointer } from '../../hooks/useMediaQuery'

type Mode = 'idle' | 'link' | 'label' | 'hidden'

const FOLLOW = { stiffness: 620, damping: 44, mass: 0.5 }
const TRAIL = { stiffness: 210, damping: 24, mass: 0.7 }

/**
 * Custom pointer for mouse users. A small difference-blended dot that swells
 * over anything clickable, and a labelled disc for elements that set
 * `data-cursor-label` ("Drag", "View", ...). Touch and reduced-motion users
 * keep the system cursor.
 *
 * The two layers are siblings on purpose: mix-blend-mode only reaches the page
 * when the blended element is not wrapped in another transformed layer.
 */
export function Cursor() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const enabled = fine && !reduce

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const dotX = useSpring(x, FOLLOW)
  const dotY = useSpring(y, FOLLOW)
  const discX = useSpring(x, TRAIL)
  const discY = useSpring(y, TRAIL)

  const [mode, setMode] = useState<Mode>('hidden')
  const [label, setLabel] = useState('')
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (!enabled) return undefined
    const root = document.documentElement
    root.classList.add('has-cursor')

    const resolve = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null
      const labelled = element?.closest<HTMLElement>('[data-cursor-label]')
      if (labelled) {
        setLabel(labelled.dataset.cursorLabel ?? '')
        setMode('label')
        return
      }
      if (element?.closest('[data-cursor="hidden"]')) {
        setMode('hidden')
        return
      }
      setMode(element?.closest('a, button, [role="button"], label, summary, [data-cursor="link"]') ? 'link' : 'idle')
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      x.set(event.clientX)
      y.set(event.clientY)
    }
    const onOver = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') resolve(event.target)
    }
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)
    const onLeave = () => setMode('hidden')

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    root.addEventListener('pointerleave', onLeave)

    return () => {
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      root.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  const dotScale = mode === 'hidden' || mode === 'label' ? 0 : mode === 'link' ? 4.2 : 1

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] -mt-[7px] -ml-[7px] size-[14px] rounded-full bg-paper mix-blend-difference"
        style={{ x: dotX, y: dotY }}
        animate={{ scale: pressed ? dotScale * 0.7 : dotScale }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      />
      <motion.div
        aria-hidden
        className="t-label pointer-events-none fixed top-0 left-0 z-[100] -mt-11 -ml-11 grid size-22 place-items-center rounded-full bg-ember text-ink"
        style={{ x: discX, y: discY }}
        initial={false}
        animate={{ scale: mode === 'label' ? (pressed ? 0.85 : 1) : 0, opacity: mode === 'label' ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      >
        {label}
      </motion.div>
    </>
  )
}
