import { Fragment } from 'react'
import { stack } from '../../content/site'
import { Marquee } from '../core/Marquee'

/** Two counter-running rows of the tools he works in, set as outlined poster type. */
export function Stack() {
  return (
    <section aria-label="Tools and technologies" className="relative z-10 bg-bg py-14 text-fg md:py-24">
      <p className="sr-only">{stack.flat().join(', ')}</p>
      {stack.map((row, rowIndex) => (
        <Marquee
          key={rowIndex}
          speed={rowIndex === 0 ? 4 : 3.2}
          direction={rowIndex === 0 ? 1 : -1}
          repeat={2}
          className="t-poster py-1 text-[clamp(3.6rem,11vw,10.5rem)]"
        >
          {row.map((tool, index) => (
            <Fragment key={tool}>
              <span
                className={
                  index % 2 === rowIndex
                    ? 'text-fg'
                    : 'text-transparent [-webkit-text-stroke:1.5px_var(--fg)]'
                }
              >
                {tool}
              </span>
              <span className="mx-[0.28em] inline-block size-[0.16em] shrink-0 rounded-full bg-accent" />
            </Fragment>
          ))}
        </Marquee>
      ))}
    </section>
  )
}
