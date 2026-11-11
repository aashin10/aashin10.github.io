import { Fragment } from 'react'
import { hero } from '../../content/site'
import { Marquee } from '../core/Marquee'

function Star() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="mx-[0.55em] size-[0.5em] shrink-0 fill-current">
      <path d="M12 0c.9 6.6 4.5 10.2 12 12-7.5 1.8-11.1 5.4-12 12-.9-6.6-4.5-10.2-12-12C7.5 10.2 11.1 6.6 12 0Z" />
    </svg>
  )
}

function Words() {
  return (
    <>
      {hero.tape.map((word) => (
        <Fragment key={word}>
          <span>{word}</span>
          <Star />
        </Fragment>
      ))}
    </>
  )
}

/**
 * Two ticker tapes crossing the seam between the stage and the first section,
 * running in opposite directions and speeding up with the scroll.
 */
export function Tapes() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 -translate-y-1/2" aria-hidden>
      <div className="-mx-[4vw] rotate-[-2.2deg]">
        <Marquee speed={5} className="surface-ember t-poster py-3 text-[clamp(1.5rem,3.4vw,3rem)] md:py-4">
          <Words />
        </Marquee>
      </div>
      <div className="-mx-[4vw] -mt-[clamp(2.6rem,5.4vw,4.9rem)] rotate-[1.6deg]">
        <Marquee
          speed={4}
          direction={-1}
          className="surface-dark t-poster border-y border-line py-3 text-[clamp(1.5rem,3.4vw,3rem)] md:py-4"
        >
          <Words />
        </Marquee>
      </div>
    </div>
  )
}
