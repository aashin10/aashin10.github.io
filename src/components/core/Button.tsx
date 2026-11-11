import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Magnetic } from './Magnetic'

type Variant = 'solid' | 'outline'

const base =
  'group relative inline-flex items-center gap-3 overflow-clip rounded-full px-6 py-3.5 text-[0.95rem] font-semibold leading-none tracking-tight transition-colors duration-500 ease-expo'
const variants: Record<Variant, string> = {
  solid: 'bg-accent text-on-accent',
  outline: 'border border-line text-fg hover:text-bg',
}

/** The fill that wipes up from the bottom edge on hover. */
function Wipe() {
  return (
    <span
      aria-hidden
      className="absolute inset-0 translate-y-[101%] rounded-[50%_50%_0_0/60%_60%_0_0] bg-fg transition-[transform,border-radius] duration-500 ease-expo group-hover:translate-y-0 group-hover:rounded-none motion-reduce:transition-none"
    />
  )
}

function Inner({ children, variant }: { children: ReactNode; variant: Variant }) {
  return (
    <>
      <Wipe />
      <span
        className={cn(
          'relative z-10 inline-flex items-center gap-3 transition-colors duration-500',
          variant === 'solid' && 'group-hover:text-bg',
        )}
      >
        {children}
      </span>
    </>
  )
}

export function Arrow({ className, down = false }: { className?: string; down?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cn(
        'size-3.5 transition-transform duration-500 ease-expo',
        down ? 'rotate-90 group-hover:translate-y-0.5' : '-rotate-45 group-hover:rotate-0',
        className,
      )}
    >
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface CommonProps {
  variant?: Variant
  magnetic?: boolean
  className?: string
  children: ReactNode
}

export function ButtonLink({
  variant = 'solid',
  magnetic = true,
  className,
  children,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const link = (
    <a className={cn(base, variants[variant], className)} {...rest}>
      <Inner variant={variant}>{children}</Inner>
    </a>
  )
  return magnetic ? <Magnetic strength={0.3}>{link}</Magnetic> : link
}

export function Button({
  variant = 'solid',
  magnetic = true,
  className,
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const button = (
    <button className={cn(base, variants[variant], className)} {...rest}>
      <Inner variant={variant}>{children}</Inner>
    </button>
  )
  return magnetic ? <Magnetic strength={0.3}>{button}</Magnetic> : button
}
