import { useSyncExternalStore } from 'react'

/** Subscribes to a CSS media query. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** True on devices with a real hovering pointer (mouse, trackpad). */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')
