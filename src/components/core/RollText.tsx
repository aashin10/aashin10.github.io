import { cn } from '../../lib/cn'

/**
 * Link label that rolls up to reveal a copy of itself on hover. Put it inside
 * an element with the `group` class; the roll is pure CSS.
 */
export function RollText({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn('relative inline-block overflow-clip align-bottom', className)}>
      <span className="block transition-transform duration-500 ease-expo group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:transition-none">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full text-accent-text transition-transform duration-500 ease-expo group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"
      >
        {children}
      </span>
    </span>
  )
}
