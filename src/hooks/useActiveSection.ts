import { useEffect, useState } from 'react'

/**
 * Which of the given section ids sits under the middle of the viewport.
 * The observer's root is squeezed to a band across the centre, and the section
 * covering most of that band wins. Sections that are not in the page yet are
 * picked up as soon as they mount.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const heights = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          heights.set(entry.target.id, entry.isIntersecting ? entry.intersectionRect.height : 0)
        }
        let best: string | null = null
        let bestHeight = 0
        for (const [id, height] of heights) {
          if (height > bestHeight) {
            best = id
            bestHeight = height
          }
        }
        setActive(best)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.01, 0.5, 1] },
    )

    const pending = new Set(ids)
    const watcher = new MutationObserver(() => attach())
    const attach = () => {
      for (const id of pending) {
        const element = document.getElementById(id)
        if (!element) continue
        observer.observe(element)
        pending.delete(id)
      }
      if (pending.size === 0) watcher.disconnect()
    }

    attach()
    if (pending.size > 0) watcher.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      watcher.disconnect()
    }
  }, [ids])

  return active
}
