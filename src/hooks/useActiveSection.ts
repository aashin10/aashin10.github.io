import { useEffect, useState } from 'react'

/**
 * Which of the given section ids sits under the middle of the viewport.
 * The observer's root is squeezed to a band across the centre, and the section
 * covering most of that band wins.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const ratios = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRect.height : 0)
        }
        let best: string | null = null
        let bestHeight = 0
        for (const [id, height] of ratios) {
          if (height > bestHeight) {
            best = id
            bestHeight = height
          }
        }
        setActive(best)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.01, 0.5, 1] },
    )

    for (const id of ids) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [ids])

  return active
}
