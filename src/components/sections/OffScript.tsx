import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'
import { offScript } from '../../content/site'
import { useFinePointer, useMediaQuery } from '../../hooks/useMediaQuery'
import { EXPO } from '../../lib/ease'
import type { ImageName } from '../../lib/images'
import { Picture } from '../core/Picture'
import { SectionLabel } from '../core/SectionLabel'
import { SplitText } from '../core/SplitText'

// Where each print lands on the table: left / top as a share of the board,
// width, and the tilt it settles at.
const LAYOUT = [
  { left: '1%', top: '3%', width: 'clamp(10rem,16vw,15rem)', rotate: -6 },
  { left: '21%', top: '5%', width: 'clamp(15rem,26vw,24rem)', rotate: 4 },
  { left: '52%', top: '0%', width: 'clamp(11rem,18vw,17rem)', rotate: -3 },
  { left: '74%', top: '13%', width: 'clamp(13rem,21vw,20rem)', rotate: 6 },
  { left: '19%', top: '54%', width: 'clamp(14rem,23vw,22rem)', rotate: 3 },
  { left: '50%', top: '53%', width: 'clamp(14rem,24vw,23rem)', rotate: -4 },
]

interface Card {
  image: string
  title: string
  note: string
  tag: string
}

function Print({ card }: { card: Card }) {
  return (
    <figure className="rounded-[0.4rem] bg-paper p-2.5 pb-3 text-ink shadow-[0_24px_50px_-18px_rgb(10_9_8/0.65)]">
      <Picture
        name={card.image as ImageName}
        alt={`${card.title}: ${card.note}`}
        sizes="(min-width: 768px) 24vw, 70vw"
        className="block h-auto w-full rounded-[0.2rem] select-none"
      />
      <figcaption className="mt-3 flex items-end justify-between gap-3 px-0.5">
        <span>
          <span className="t-serif block text-[1.25rem] leading-tight">{card.title}</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-ink/70">{card.note}</span>
        </span>
        <span className="t-label shrink-0 text-ink/60">{card.tag}</span>
      </figcaption>
    </figure>
  )
}

/** Life outside the editor, as a pile of prints you can push around the table. */
export function OffScript() {
  const boardRef = useRef<HTMLDivElement>(null)
  const inView = useInView(boardRef, { once: true, amount: 0.25 })
  const reduce = useReducedMotion()
  const fine = useFinePointer()
  const roomy = useMediaQuery('(min-width: 768px)')
  const scatter = fine && roomy
  const [order, setOrder] = useState(() => offScript.cards.map((_, index) => index))

  const raise = (index: number) => setOrder((current) => [...current.filter((value) => value !== index), index])

  return (
    <section id="off-script" aria-labelledby="off-script-heading" className="surface-ember relative z-10 overflow-clip">
      <div className="shell pt-24 pb-20 md:pt-36 md:pb-28">
        <SectionLabel index="05" name="Off script" aside="Beyond the code" />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-5 md:mt-12">
          <SplitText
            as="h2"
            by="char"
            id="off-script-heading"
            text="Off script"
            className="t-poster text-[clamp(4rem,15vw,16rem)]"
          />
          <p className="max-w-[22rem] pb-2 text-lg font-medium md:pb-6 md:text-xl">
            {offScript.intro} {scatter ? offScript.hintDrag : offScript.hintSwipe}
          </p>
        </div>

        {scatter ? (
          <div ref={boardRef} className="relative mt-10 h-[clamp(38rem,58vw,52rem)]">
            {offScript.cards.map((card, index) => {
              const spot = LAYOUT[index % LAYOUT.length]!
              return (
                <motion.div
                  key={card.image}
                  drag
                  dragConstraints={boardRef}
                  dragElastic={0.14}
                  dragTransition={{ power: 0.18, timeConstant: 240 }}
                  onPointerDown={() => raise(index)}
                  whileDrag={{ scale: 1.05, rotate: 0 }}
                  whileHover={{ scale: 1.02 }}
                  data-cursor-label="Drag"
                  className="absolute cursor-grab touch-none active:cursor-grabbing"
                  style={{ left: spot.left, top: spot.top, width: spot.width, zIndex: order.indexOf(index) + 1 }}
                  initial={reduce ? false : { opacity: 0, y: 220, rotate: spot.rotate * 4, scale: 0.8 }}
                  animate={
                    inView || reduce ? { opacity: 1, y: 0, rotate: spot.rotate, scale: 1 } : undefined
                  }
                  transition={{ type: 'spring', stiffness: 110, damping: 15, mass: 0.9, delay: index * 0.09 }}
                >
                  <Print card={card} />
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div
            ref={boardRef}
            className="-mx-[clamp(1.25rem,4vw,4rem)] mt-10 flex snap-x snap-mandatory items-center gap-5 overflow-x-auto px-[clamp(1.25rem,4vw,4rem)] py-8 [scrollbar-width:none]"
          >
            {offScript.cards.map((card, index) => (
              <motion.div
                key={card.image}
                className="w-[72vw] max-w-[20rem] shrink-0 snap-center"
                style={{ rotate: (LAYOUT[index % LAYOUT.length]?.rotate ?? 0) * 0.5 }}
                initial={{ opacity: 0, transform: 'translateY(40px)' }}
                whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, ease: EXPO, delay: index * 0.05 }}
              >
                <Print card={card} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
