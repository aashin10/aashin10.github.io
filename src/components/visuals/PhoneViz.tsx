import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import type { PointerEvent } from 'react'
import { Picture } from '../core/Picture'

const SPRING = { stiffness: 130, damping: 16, mass: 0.8 }

const CHIPS = [
  { text: '+$80 owes you', className: 'top-[16%] left-[4%] md:left-[10%]', drift: 5.5, delay: 0 },
  { text: 'Settled ✓', className: 'top-[44%] right-[3%] md:right-[9%]', drift: 6.5, delay: 0.8 },
  { text: '5 open tabs', className: 'bottom-[14%] left-[6%] md:left-[13%]', drift: 7, delay: 1.6 },
]

/** The app on a handset that leans toward the pointer, with tabs floating round it. */
export function PhoneViz() {
  const reduce = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-16, 16]), SPRING)
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [12, -12]), SPRING)
  const chipX = useSpring(useTransform(pointerX, [-0.5, 0.5], [18, -18]), SPRING)
  const chipY = useSpring(useTransform(pointerY, [-0.5, 0.5], [12, -12]), SPRING)

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || reduce) return
    const box = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - box.left) / box.width - 0.5)
    pointerY.set((event.clientY - box.top) / box.height - 0.5)
  }
  const onLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <div
      className="relative grid size-full place-items-center overflow-clip [perspective:1100px]"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <span aria-hidden className="t-poster absolute text-[clamp(9rem,26vw,24rem)] text-paper/[0.06] select-none">
        IOU
      </span>

      <motion.div
        className="relative aspect-[780/1688] h-[86%] max-h-[34rem] will-change-transform"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 rounded-[13%/6%] border border-paper/15 bg-[#050505] shadow-[0_40px_80px_-20px_rgb(0_0_0/0.8)]" />
        <Picture
          name="debtflix"
          alt="Debtflix home screen listing who owes what across five open tabs"
          sizes="(min-width: 1024px) 18rem, 50vw"
          className="absolute inset-[2.6%_5.6%] size-[auto] h-[94.8%] w-[88.8%] rounded-[11%/5%] object-cover"
        />
      </motion.div>

      {CHIPS.map((chip) => (
        <motion.div key={chip.text} className={`absolute ${chip.className}`} style={{ x: chipX, y: chipY }} aria-hidden>
          <div
            className="t-label rounded-full bg-paper px-3.5 py-2 text-ink shadow-[0_10px_30px_-8px_rgb(0_0_0/0.6)] motion-reduce:animate-none"
            style={{ animation: `float ${chip.drift}s ease-in-out ${chip.delay}s infinite` }}
          >
            {chip.text}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
