import { useEffect, useState } from 'react'
import { person } from '../../content/site'

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: person.timeZone,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

/** Live local time where Aashin is, so visitors know if he is likely awake. */
export function Clock({ className }: { className?: string }) {
  const [now, setNow] = useState(() => formatter.format(new Date()))

  useEffect(() => {
    const id = window.setInterval(() => setNow(formatter.format(new Date())), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <time className={className} dateTime={now} suppressHydrationWarning>
      <span className="tabular-nums">{now}</span> {person.timeZoneLabel}
    </time>
  )
}
