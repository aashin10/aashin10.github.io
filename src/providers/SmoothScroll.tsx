import Lenis from 'lenis'
import { cancelFrame, frame, useReducedMotion } from 'motion/react'
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

const LenisContext = createContext<Lenis | null>(null)

/**
 * Inertial page scrolling. Lenis still moves the real scroll position, so
 * scroll-linked animation, anchors and keyboard scrolling keep working. It is
 * stepped from Motion's frame loop so both read the same scroll value each
 * frame. People who ask for reduced motion get the browser's native scroll.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (reduce) return undefined

    const instance = new Lenis({ lerp: 0.11, wheelMultiplier: 1, touchMultiplier: 1.4 })
    const update = (data: { timestamp: number }) => instance.raf(data.timestamp)
    frame.update(update, true)
    setLenis(instance)

    return () => {
      cancelFrame(update)
      instance.destroy()
      setLenis(null)
    }
  }, [reduce])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export const useLenis = () => useContext(LenisContext)

/** Scrolls to a section id (or the top), smoothly when motion is welcome. */
export function useScrollTo() {
  const lenis = useLenis()
  return useCallback(
    (target: string | number, options?: { offset?: number; immediate?: boolean }) => {
      const element = typeof target === 'string' ? document.getElementById(target) : null
      if (typeof target === 'string' && !element) return

      if (lenis) {
        lenis.scrollTo(element ?? (target as number), {
          offset: options?.offset ?? 0,
          immediate: options?.immediate,
          duration: 1.4,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        })
      } else if (element) {
        element.scrollIntoView({ behavior: 'auto', block: 'start' })
      } else {
        window.scrollTo({ top: target as number, behavior: 'auto' })
      }

      // Move keyboard focus with the viewport so the next Tab starts there.
      if (element) {
        if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1')
        element.focus({ preventScroll: true })
      }
    },
    [lenis],
  )
}

/** Freezes page scrolling while an overlay (preloader, menu) is open. */
export function useScrollLock(locked: boolean) {
  const lenis = useLenis()
  useEffect(() => {
    if (!locked) return undefined
    lenis?.stop()
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
      lenis?.start()
    }
  }, [locked, lenis])
}
