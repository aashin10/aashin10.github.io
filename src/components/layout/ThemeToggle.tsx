import type { MouseEvent } from 'react'
import { cn } from '../../lib/cn'
import { useTheme } from '../../providers/Theme'

/** "House lights": flips between the dark stage and the lit auditorium. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const lit = theme === 'light'

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    toggle({ x: box.left + box.width / 2, y: box.top + box.height / 2 })
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={lit}
      aria-label="House lights"
      title={lit ? 'House lights: on' : 'House lights: off'}
      onClick={onClick}
      className={cn('group flex items-center gap-2.5 rounded-full py-1.5 pr-1.5 pl-1.5 sm:pl-3', className)}
    >
      <span className="t-label hidden text-muted transition-colors duration-300 group-hover:text-fg sm:inline">
        House lights
      </span>
      <span className="relative h-6 w-11 rounded-full border border-line transition-colors duration-500">
        <span
          className={cn(
            'absolute top-1/2 left-[3px] size-[16px] -translate-y-1/2 rounded-full transition-[transform,background-color,box-shadow] duration-500 ease-expo',
            lit ? 'translate-x-[20px] bg-accent shadow-[0_0_14px_var(--accent)]' : 'bg-faint',
          )}
        />
      </span>
    </button>
  )
}
