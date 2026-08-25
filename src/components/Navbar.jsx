import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { Link } from "react-router-dom";
import { close, menu } from "../assets";
import { navLinks } from "../data";

// The page scrolls inside .wrapper, not the window, so the scroll signal has to
// come from that element's ref. How long the nav stays awake after the last
// scroll event before it settles back down.
const IDLE_DELAY = 1200;

// Spring rather than a curve: the rail can be interrupted mid-open by the
// pointer leaving, and springs handle that without a visible snap.
const PANEL_TRANSITION = { type: "spring", bounce: 0.18, duration: 0.45 };
const LABEL_TRANSITION = { type: "spring", bounce: 0.2, duration: 0.4 };
// Reduced motion keeps the collapse -- that is layout, not decoration -- and
// only drops the travel between the two states.
const INSTANT = { duration: 0 };

const Navbar = ({ scrollContainer }) => {
  const [active, setActive] = useState("hero");
  const [toggle, setToggle] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  // Tapped open on a touch screen, where there is no hover to rely on.
  const [pinned, setPinned] = useState(false);

  const reduceMotion = useReducedMotion();

  const railRef = useRef(null);
  const idleTimer = useRef(null);
  const { scrollY } = useScroll({
    container: scrollContainer,
    layoutEffect: false,
  });

  useMotionValueEvent(scrollY, "change", () => {
    // React bails out when the value is unchanged, so this only re-renders on
    // the idle -> scrolling edge.
    setIsScrolling(true);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIsScrolling(false), IDLE_DELAY);
  });

  useEffect(() => () => clearTimeout(idleTimer.current), []);

  const expanded = isScrolling || hovered || focusWithin || pinned;

  // A tap-opened rail needs an explicit way out: anywhere else, or Escape.
  useEffect(() => {
    if (!pinned) return undefined;

    const onPointerDown = (e) => {
      if (!railRef.current?.contains(e.target)) setPinned(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setPinned(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [pinned]);

  useEffect(() => {
    // Observe the named sections only. A bare "div[id]" also matches #root --
    // which always intersects -- and any div a browser extension injects, and
    // with last-entry-wins those would overwrite the real answer.
    const ids = navLinks.map((nav) => nav.id);
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);

    // rootMargin squeezes the root to a band across the middle of the viewport,
    // so "active" means "the section under the middle of the screen". Ratios
    // are kept per section and the largest wins, rather than whichever entry
    // the observer happened to report last.
    const ratios = new Map(ids.map((id) => [id, 0]));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0
          );
        }

        let best = null;
        let bestRatio = 0;
        for (const id of ids) {
          const ratio = ratios.get(id);
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        // Nothing in the band (a gap between sections) keeps the last answer.
        if (best) setActive(best);
      },
      {
        threshold: [0, 0.01, 0.25, 0.5, 0.75, 1],
        rootMargin: "-40% 0px -40% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="w-full flex items-center bg-gradient-to-b from-black sm:bg-none p-8 sm:px-16 sm:py-10 fixed z-40 pointer-events-none"
    >
      <div className='w-full flex justify-between items-start mx-auto'>
        <Link
          to='/'
          className='flex items-start'
          onClick={() => {
            setActive("hero");
            window.scrollTo(0, 0);
          }}
        >
          <p className='text-white text-[26px] lg:text-[36px] font-bold pointer-events-auto cursor-pointer flex'>
            AT
          </p>
        </Link>

        <motion.div
          ref={railRef}
          className='nav-rail hidden sm:block pointer-events-auto px-4 py-3'
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          onPointerDown={() => setPinned(true)}
          onFocus={() => setFocusWithin(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setFocusWithin(false);
          }}
        >
          <AnimatePresence>
            {expanded && (
              <motion.span
                key='panel'
                className='nav-rail__panel'
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={reduceMotion ? INSTANT : PANEL_TRANSITION}
              />
            )}
          </AnimatePresence>
          <span className='nav-rail__spine' />

          <ul className='relative list-none flex flex-col items-end gap-4'>
            {navLinks.map((nav, i) => (
              <li key={nav.id} className='flex'>
                <a
                  href={`#${nav.id}`}
                  onClick={() => {
                    setActive(nav.id);
                    setPinned(false);
                  }}
                  // The label unmounts when collapsed, so the name lives here.
                  aria-label={nav.title}
                  data-active={active === nav.id}
                  aria-current={active === nav.id ? "true" : undefined}
                  className='nav-rail__item flex h-8 items-center justify-end gap-3 cursor-pointer'
                >
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.span
                        key='label'
                        className='nav-rail__label text-[15px] lg:text-[18px] font-semibold tracking-wide'
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={
                          reduceMotion
                            ? INSTANT
                            : { ...LABEL_TRANSITION, delay: i * 0.03 }
                        }
                      >
                        {nav.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span className='nav-rail__marker' />
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        <div className='sm:hidden flex flex-1 justify-end items-center'>
          <img
            src={toggle ? close : menu}
            alt='menu'
            className='w-[28px] h-[28px] object-contain pointer-events-auto cursor-pointer'
            onClick={() => setToggle(!toggle)}
          />

          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-30 rounded-xl`}
          >
            <ul className='list-none flex justify-end items-start flex-1 flex-col gap-4'>
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins font-medium cursor-pointer text-[16px] ${
                    active === nav.id ? "text-quaternary" : "text-secondary"
                  }`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(nav.id);
                  }}
                >
                  <a href={`#${nav.id}`}>{nav.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
