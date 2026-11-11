import { motion, type Variants } from 'motion/react'
import { useMemo } from 'react'
import { cn } from '../../lib/cn'
import { EXPO } from '../../lib/ease'

// The elements a split heading or line can be rendered as.
const TAGS = {
  span: motion.span,
  p: motion.p,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
}

interface SplitTextProps {
  text: string
  /** Element to render. */
  as?: keyof typeof TAGS
  /** Animate each word (default) or each character. */
  by?: 'word' | 'char'
  className?: string
  id?: string
  /** Class for every animated piece, e.g. to colour or restyle it. */
  pieceClassName?: string
  delay?: number
  stagger?: number
  duration?: number
  /** Omit to reveal when scrolled into view; pass a boolean to control it. */
  show?: boolean
  amount?: number
}

const piece: Variants = {
  hidden: { transform: 'translateY(115%)' },
  show: ({ duration }: { duration: number }) => ({
    transform: 'translateY(0%)',
    transition: { duration, ease: EXPO },
  }),
}

/**
 * Text that rises out of a mask, word by word or letter by letter.
 * Screen readers get the plain sentence; the animated copy is hidden from them.
 */
export function SplitText({
  text,
  as = 'span',
  by = 'word',
  className,
  id,
  pieceClassName,
  delay = 0,
  stagger = by === 'char' ? 0.035 : 0.06,
  duration = 1,
  show,
  amount = 0.5,
}: SplitTextProps) {
  const words = useMemo(() => text.split(' '), [text])
  const container: Variants = useMemo(
    () => ({ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }),
    [stagger, delay],
  )

  const controlled = show !== undefined
  const MotionTag = TAGS[as] as typeof motion.span

  return (
    <MotionTag
      id={id}
      className={className}
      variants={container}
      initial="hidden"
      animate={controlled ? (show ? 'show' : 'hidden') : undefined}
      whileInView={controlled ? undefined : 'show'}
      viewport={controlled ? undefined : { once: true, amount }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {by === 'word' ? (
              <Mask>
                <motion.span className={cn('inline-block', pieceClassName)} variants={piece} custom={{ duration }}>
                  {word}
                </motion.span>
              </Mask>
            ) : (
              Array.from(word).map((char, charIndex) => (
                <Mask key={charIndex}>
                  <motion.span className={cn('inline-block', pieceClassName)} variants={piece} custom={{ duration }}>
                    {char}
                  </motion.span>
                </Mask>
              ))
            )}
            {wordIndex < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </MotionTag>
  )
}

/** Clips its child; padded so tight display line-heights do not shave glyphs. */
function Mask({ children }: { children: React.ReactNode }) {
  return <span className="-my-[0.08em] inline-block overflow-clip py-[0.08em] align-bottom">{children}</span>
}
