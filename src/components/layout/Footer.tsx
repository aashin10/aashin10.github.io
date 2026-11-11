import type { MouseEvent } from 'react'
import { person, socials } from '../../content/site'
import { useScrollTo } from '../../providers/SmoothScroll'
import { Magnetic } from '../core/Magnetic'
import { RollText } from '../core/RollText'

export function Footer() {
  const scrollTo = useScrollTo()
  const toTop = (event: MouseEvent) => {
    event.preventDefault()
    scrollTo('top')
  }

  return (
    <footer className="surface-dark relative z-10 overflow-clip border-t hairline">
      <div className="shell flex flex-wrap items-center justify-between gap-x-10 gap-y-6 py-8">
        <p className="t-label text-muted">
          © {person.year} {person.name} · {person.location}
        </p>
        <ul className="t-label flex items-center gap-7">
          {socials.map((social) => (
            <li key={social.label}>
              <a href={social.href} target="_blank" rel="noopener noreferrer" className="group">
                <RollText>{social.label}</RollText>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="t-label text-muted">Built with React, Motion &amp; WebGL</p>
        <Magnetic>
          <a
            href="#top"
            onClick={toTop}
            className="group t-label flex items-center gap-3 rounded-full border border-line py-2 pr-2 pl-5 transition-colors duration-500 hover:border-fg"
          >
            Back to top
            <span className="grid size-9 place-items-center rounded-full bg-accent text-on-accent transition-transform duration-500 ease-expo group-hover:-translate-y-1">
              <svg viewBox="0 0 16 16" aria-hidden className="size-3.5">
                <path d="M8 14V2M3 7l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </Magnetic>
      </div>

      {/* The sign-off: the name at full width. Each letter opens up under the pointer. */}
      <p aria-hidden className="t-poster -mb-[0.09em] px-[2vw] text-center text-[13.4vw] whitespace-nowrap select-none">
        {Array.from(person.name).map((char, index) =>
          char === ' ' ? (
            <span key={index} className="inline-block w-[0.18em]" />
          ) : (
            <span
              key={index}
              className="inline-block text-fg/90 transition-[font-variation-settings,color] duration-700 ease-expo [font-variation-settings:'wdth'_62,'wght'_900] hover:text-accent hover:duration-200 hover:[font-variation-settings:'wdth'_104,'wght'_900] motion-reduce:transition-none"
            >
              {char}
            </span>
          ),
        )}
      </p>
    </footer>
  )
}
