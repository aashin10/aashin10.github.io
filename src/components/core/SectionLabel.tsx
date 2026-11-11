import { cn } from '../../lib/cn'

/** The thin ruled strip that opens every section: "(02) Now showing ——— Work". */
export function SectionLabel({
  index,
  name,
  aside,
  className,
}: {
  index: string
  name: string
  aside?: string
  className?: string
}) {
  return (
    <div className={cn('t-label flex items-center justify-between gap-6 border-b hairline pb-4 text-muted', className)}>
      <span>
        <span className="text-accent-text">({index})</span> {name}
      </span>
      {aside ? <span>{aside}</span> : null}
    </div>
  )
}
