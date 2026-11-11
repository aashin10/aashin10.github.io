import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useId, useMemo, useState, type FormEvent } from 'react'
import { contact, person, socials } from '../../content/site'
import { cn } from '../../lib/cn'
import { EXPO } from '../../lib/ease'
import { seeded } from '../../lib/math'
import { Arrow, Button } from '../core/Button'
import { Clock } from '../core/Clock'
import { RollText } from '../core/RollText'
import { SectionLabel } from '../core/SectionLabel'
import { SplitText } from '../core/SplitText'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="surface-dark relative z-10 overflow-clip">
      {/* A last wash of stage light behind the closing number. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70rem] bg-[radial-gradient(60%_55%_at_70%_0%,rgb(255_77_33/0.2),transparent_70%),radial-gradient(40%_40%_at_15%_10%,rgb(255_207_153/0.1),transparent_70%)]"
      />
      <div className="shell relative pt-24 pb-20 md:pt-36 md:pb-28">
        <SectionLabel index="06" name="Encore" aside="Contact" />
        <h2 id="contact-heading" className="mt-8 md:mt-12">
          <SplitText text={contact.heading[0]} by="char" className="t-poster block text-[clamp(3.6rem,13.5vw,15rem)]" />
          <SplitText
            text={contact.heading[1]}
            by="char"
            delay={0.1}
            className="t-poster block text-[clamp(3.6rem,13.5vw,15rem)]"
          />
          <SplitText
            text={contact.heading[2]}
            delay={0.25}
            className="t-serif mt-[0.08em] block text-[clamp(2.6rem,9.5vw,10.5rem)] leading-[0.95] text-accent-text"
          />
        </h2>

        <div className="mt-14 grid gap-14 md:mt-24 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="max-w-[26rem] text-lg leading-relaxed text-muted">{contact.intro}</p>

            <ul className="mt-10 border-t hairline">
              {socials.map((social) => (
                <li key={social.label} className="border-b hairline">
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 py-5"
                  >
                    <span className="text-2xl font-semibold tracking-tight">
                      <RollText>{social.label}</RollText>
                    </span>
                    <span className="t-label flex items-center gap-3 text-muted">
                      {social.handle}
                      <Arrow className="size-3 text-fg" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <dl className="t-label mt-10 grid grid-cols-2 gap-6">
              <div>
                <dt className="text-muted">Status</dt>
                <dd className="mt-2 flex items-center gap-2">
                  <span className="size-2 animate-[blink_1.6s_ease-in-out_infinite] rounded-full bg-accent motion-reduce:animate-none" />
                  Taking on projects
                </dd>
              </div>
              <div>
                <dt className="text-muted">{person.location}</dt>
                <dd className="mt-2">
                  <Clock />
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [topic, setTopic] = useState<string>(contact.topics[0])
  const formId = useId()

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    // Bots fill every field; people never see this one.
    if (data.get('_gotcha')) return

    setStatus('sending')
    try {
      const response = await fetch(contact.endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) throw new Error(`Form endpoint answered ${response.status}`)
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'sent' ? (
          <motion.div
            key="sent"
            role="status"
            className="relative rounded-3xl border border-line p-8 md:p-12"
            initial={{ opacity: 0, transform: 'translateY(24px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: EXPO }}
          >
            <Confetti />
            <p className="t-label text-accent-text">Applause</p>
            <p className="t-serif mt-4 text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.05]">{contact.success}</p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="t-label mt-8 underline decoration-line underline-offset-4 hover:decoration-current"
            >
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            className="grid gap-x-8 gap-y-9 sm:grid-cols-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transform: 'translateY(-16px)' }}
            transition={{ duration: 0.4 }}
          >
            <Field id={`${formId}-name`} label="Your name" name="name" autoComplete="name" required />
            <Field id={`${formId}-email`} label="Email" name="email" type="email" autoComplete="email" required />

            <fieldset className="sm:col-span-2">
              <legend className="t-label text-muted">What are we making?</legend>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {contact.topics.map((option) => (
                  <label
                    key={option}
                    className={cn(
                      'cursor-pointer rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-300 has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-accent',
                      topic === option ? 'border-accent bg-accent text-on-accent' : 'border-line hover:border-fg',
                    )}
                  >
                    <input
                      type="radio"
                      name="topic"
                      value={option}
                      checked={topic === option}
                      onChange={() => setTopic(option)}
                      className="sr-only"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>

            <Field
              id={`${formId}-message`}
              label="Tell me about it"
              name="message"
              multiline
              required
              className="sm:col-span-2"
            />

            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 sm:col-span-2">
              <Button type="submit" disabled={status === 'sending'} className="px-9 py-5 text-lg disabled:opacity-70">
                {status === 'sending' ? 'Sending…' : 'Send it'}
                <Arrow className="size-4" />
              </Button>
              <p role="status" aria-live="polite" className="max-w-[22rem] text-sm text-muted">
                {status === 'error' ? <span className="text-accent-text">{contact.failure}</span> : 'No newsletter, no tracking. Just a reply.'}
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Underlined input whose rule lights up from the left on focus. */
function Field({
  id,
  label,
  name,
  type = 'text',
  multiline = false,
  required = false,
  autoComplete,
  className,
}: {
  id: string
  label: string
  name: string
  type?: string
  multiline?: boolean
  required?: boolean
  autoComplete?: string
  className?: string
}) {
  const shared = {
    id,
    name,
    required,
    autoComplete,
    placeholder: ' ',
    className:
      'peer w-full resize-none border-0 border-b border-line bg-transparent pt-7 pb-3 text-xl font-medium text-fg outline-none placeholder:text-transparent focus:outline-none',
  }

  return (
    <div className={cn('relative', className)}>
      {multiline ? <textarea rows={4} {...shared} /> : <input type={type} {...shared} />}
      <label
        htmlFor={id}
        className="t-label pointer-events-none absolute top-8 left-0 origin-left text-muted transition-transform duration-500 ease-expo peer-focus:-translate-y-7 peer-focus:text-accent-text peer-[:not(:placeholder-shown)]:-translate-y-7 motion-reduce:transition-none"
      >
        {label}
        {required ? <span aria-hidden> *</span> : null}
      </label>
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-700 ease-expo peer-focus:scale-x-100 motion-reduce:transition-none"
      />
    </div>
  )
}

/** A short burst from the corner of the thank-you card. */
function Confetti() {
  const reduce = useReducedMotion()
  const pieces = useMemo(() => {
    const random = seeded(11)
    return Array.from({ length: 26 }, (_, index) => ({
      id: index,
      x: (random() - 0.35) * 520,
      y: -(120 + random() * 260),
      rotate: (random() - 0.5) * 720,
      size: 6 + random() * 8,
      color: ['#ff4d21', '#f1ebdd', '#ffcf99'][index % 3],
      delay: random() * 0.12,
    }))
  }, [])

  if (reduce) return null

  return (
    <div aria-hidden className="pointer-events-none absolute bottom-10 left-10">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute block rounded-[2px]"
          style={{ width: piece.size, height: piece.size * 0.6, backgroundColor: piece.color }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: piece.x, y: [0, piece.y, piece.y + 420], rotate: piece.rotate, opacity: [1, 1, 0] }}
          transition={{ duration: 1.9, ease: [0.2, 0.7, 0.3, 1], delay: piece.delay, times: [0, 0.35, 1] }}
        />
      ))}
    </div>
  )
}
