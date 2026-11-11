import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { nav, person, socials } from '../../content/site'
import { useActiveSection } from '../../hooks/useActiveSection'
import { cn } from '../../lib/cn'
import { EXPO, QUART } from '../../lib/ease'
import { useCurtainUp } from '../../providers/Stage'
import { useScrollLock, useScrollTo } from '../../providers/SmoothScroll'
import { Arrow } from '../core/Button'
import { Clock } from '../core/Clock'
import { RollText } from '../core/RollText'
import { ThemeToggle } from './ThemeToggle'

const SECTION_IDS = nav.map((item) => item.id)

export function Nav() {
  const curtainUp = useCurtainUp()
  const scrollTo = useScrollTo()
  const active = useActiveSection(SECTION_IDS)
  const { scrollY } = useScroll()

  const [docked, setDocked] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  // Tuck the bar away while reading down the page; bring it back on the way up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const previous = scrollY.getPrevious() ?? 0
    setDocked(y > 48)
    if (y > previous && y > 520) setHidden(true)
    else if (y < previous) setHidden(false)
  })

  useScrollLock(open)

  // While the menu is open the page behind it is inert, so Tab stays in the menu.
  useEffect(() => {
    if (!open) return undefined
    const behind = document.querySelectorAll<HTMLElement>('#main, footer')
    behind.forEach((element) => element.setAttribute('inert', ''))
    return () => behind.forEach((element) => element.removeAttribute('inert'))
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id: string) => (event: MouseEvent) => {
    event.preventDefault()
    setOpen(false)
    // Let the overlay release the scroll lock before travelling.
    window.setTimeout(() => scrollTo(id), open ? 60 : 0)
  }

  return (
    <>
      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-[70]"
        initial={false}
        animate={{ transform: !curtainUp || (hidden && !open) ? 'translateY(-130%)' : 'translateY(0%)' }}
        transition={{ duration: 0.8, ease: EXPO, delay: curtainUp && !hidden ? 0.05 : 0 }}
      >
        {/* Over the hero the bar is bare and always reads on the dark stage;
            once the page moves it docks into a pill that follows the theme. */}
        <div
          className={cn(
            'pointer-events-auto mx-auto flex items-center justify-between gap-4 border transition-[max-width,margin,padding,background-color,border-color,border-radius] duration-700 ease-expo',
            docked && !open
              ? 'mt-3 max-w-[min(58rem,calc(100%-1.5rem))] rounded-full border-line bg-bg/70 px-3 py-2 text-fg backdrop-blur-xl'
              : 'scope-dark mt-0 max-w-[120rem] rounded-none border-transparent px-[clamp(1.25rem,4vw,4rem)] py-5 text-fg',
          )}
        >
          <a
            href="#top"
            onClick={go('top')}
            className="group flex items-center gap-2.5 py-1 pl-1"
            aria-label={`${person.name} — back to top`}
          >
            <span className="relative grid size-2.5 place-items-center">
              <span className="absolute size-2.5 animate-[blink_1.6s_ease-in-out_infinite] rounded-full bg-accent motion-reduce:animate-none" />
            </span>
            <span className="t-label">
              <RollText>{person.name}</RollText>
            </span>
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={go(item.id)}
                    aria-current={active === item.id ? 'true' : undefined}
                    className="group t-label relative block px-3 py-2"
                  >
                    <RollText>{item.label}</RollText>
                    {active === item.id && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-3 -bottom-0.5 h-px bg-accent"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="group t-label flex items-center gap-2.5 rounded-full border border-line px-4 py-2.5 lg:hidden"
            >
              <span className="relative block h-2 w-4" aria-hidden>
                <span
                  className={cn(
                    'absolute left-0 h-px w-full bg-current transition-transform duration-500 ease-expo',
                    open ? 'top-1/2 rotate-45' : 'top-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 h-px w-full bg-current transition-transform duration-500 ease-expo',
                    open ? 'top-1/2 -rotate-45' : 'bottom-0',
                  )}
                />
              </span>
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="surface-dark fixed inset-0 z-[60] flex flex-col overflow-y-auto"
            data-lenis-prevent
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.85, ease: QUART }}
          >
            <nav aria-label="Menu" className="shell flex flex-1 flex-col justify-center pt-28 pb-8">
              <ul>
                {nav.map((item, index) => (
                  <li key={item.id} className="overflow-clip border-b hairline">
                    <motion.a
                      href={`#${item.id}`}
                      onClick={go(item.id)}
                      className="group flex items-baseline justify-between gap-4 py-3"
                      initial={{ transform: 'translateY(110%)' }}
                      animate={{ transform: 'translateY(0%)' }}
                      exit={{ transform: 'translateY(110%)' }}
                      transition={{ duration: 0.9, ease: EXPO, delay: 0.25 + index * 0.06 }}
                    >
                      <span className="t-poster text-[clamp(2.75rem,13vw,6rem)] transition-colors duration-300 group-hover:text-accent-text">
                        {item.label}
                      </span>
                      <span className="t-label text-muted">0{index + 1}</span>
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div
              className="shell t-label flex flex-wrap items-center justify-between gap-x-8 gap-y-3 pb-8 text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex gap-6">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 text-fg"
                  >
                    {social.label}
                    <Arrow className="size-3" />
                  </a>
                ))}
              </div>
              <span>
                {person.location} · <Clock />
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
