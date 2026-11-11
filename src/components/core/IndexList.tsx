import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { useRef, useState, type PointerEvent } from 'react'
import type { IndexEntry } from '../../content/site'
import { useFinePointer } from '../../hooks/useMediaQuery'
import { EXPO } from '../../lib/ease'
import { hasImage } from '../../lib/images'
import { Arrow } from './Button'
import { Picture } from './Picture'

const FOLLOW = { stiffness: 190, damping: 22, mass: 0.6 }

/**
 * A ruled list of links. Each row floods with the accent on hover, and rows
 * that carry an image show it as a card that trails the pointer.
 */
export function IndexList({ heading, entries, cta }: { heading: string; entries: IndexEntry[]; cta: string }) {
  const fine = useFinePointer()
  const listRef = useRef<HTMLUListElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const x = useSpring(useMotionValue(0), FOLLOW)
  const y = useSpring(useMotionValue(0), FOLLOW)

  const onMove = (event: PointerEvent<HTMLUListElement>) => {
    const box = listRef.current?.getBoundingClientRect()
    if (!box || event.pointerType !== 'mouse') return
    x.set(event.clientX - box.left)
    y.set(event.clientY - box.top)
  }

  const preview = hovered === null ? undefined : entries[hovered]?.image
  const previewName = preview && hasImage(preview) ? preview : null

  return (
    <div>
      <div className="t-label mb-4 flex items-center justify-between text-muted">
        <h3>{heading}</h3>
        <span className="tabular-nums">{String(entries.length).padStart(2, '0')}</span>
      </div>

      <ul ref={listRef} className="relative border-t hairline" onPointerMove={onMove} onPointerLeave={() => setHovered(null)}>
        {entries.map((entry, index) => (
          <motion.li
            key={entry.title}
            className="border-b hairline"
            initial={{ opacity: 0, transform: 'translateY(20px)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: EXPO, delay: index * 0.06 }}
          >
            <a
              href={entry.href}
              target="_blank"
              rel="noopener noreferrer"
              onPointerEnter={() => setHovered(index)}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
              className="group relative grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 overflow-clip px-1 py-5 md:grid-cols-[minmax(0,5fr)_minmax(0,5fr)_8rem_4rem_auto] md:px-3 md:py-7"
            >
              {/* The flood. */}
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-expo group-hover:scale-y-100 group-focus-visible:scale-y-100 motion-reduce:transition-none"
              />
              <span className="relative text-[clamp(1.35rem,2.6vw,2.4rem)] leading-tight font-semibold tracking-[-0.03em] transition-[color,transform] duration-500 ease-expo group-hover:translate-x-2 group-hover:text-on-accent group-focus-visible:text-on-accent motion-reduce:transform-none">
                {entry.title}
              </span>
              <span className="relative col-span-2 max-w-[34rem] text-sm leading-snug text-muted transition-colors duration-500 group-hover:text-on-accent group-focus-visible:text-on-accent md:col-span-1 md:text-[0.95rem]">
                {entry.detail}
              </span>
              <span className="t-label relative hidden text-muted transition-colors duration-500 group-hover:text-on-accent group-focus-visible:text-on-accent md:block">
                {entry.tag}
              </span>
              <span className="t-label relative hidden text-muted tabular-nums transition-colors duration-500 group-hover:text-on-accent group-focus-visible:text-on-accent md:block">
                {entry.year || '—'}
              </span>
              <span className="t-label relative col-start-2 row-start-1 flex items-center gap-2 transition-colors duration-500 group-hover:text-on-accent group-focus-visible:text-on-accent md:col-start-auto md:row-start-auto">
                <span className="hidden sm:inline">{cta}</span>
                <Arrow className="size-3" />
                <span className="sr-only">(opens in a new tab)</span>
              </span>
            </a>
          </motion.li>
        ))}

        {/* Floating preview, mouse only. */}
        {fine && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 z-20 -mt-28 ml-8 w-72 will-change-transform"
            style={{ x, y }}
          >
            <AnimatePresence>
              {previewName && (
                <motion.div
                  key={previewName}
                  className="absolute inset-x-0 top-0 overflow-clip rounded-xl border border-ink/20 bg-ink shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)]"
                  initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: -3 }}
                  exit={{ opacity: 0, scale: 0.7, rotate: 4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                >
                  <Picture name={previewName} alt="" sizes="18rem" className="block h-auto w-full" eager />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </ul>
    </div>
  )
}
