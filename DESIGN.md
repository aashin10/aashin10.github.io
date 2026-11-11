# Design notes

## The idea

Aashin writes scheduling software for a living and hosts company events for a thousand people. The site
puts those two facts together: **websites with stage presence**. The page is staged like a show — a dark
stage, a follow-spot, numbered cues — and the engineering shows up as things that actually run: a
scheduler re-planning itself, a sprint board moving its tickets.

The theatre vocabulary is kept light. It appears in labels ("Now showing", "Running order", "Encore"),
never as props or clip-art.

## Palette

Three colours and nothing else.

| Token | Value | Role |
|---|---|---|
| `ink` | `#0a0908` | Stage black |
| `paper` | `#f1ebdd` | Programme paper |
| `ember` | `#ff4d21` | The one hot gel: accents, buttons, one full section |
| `tungsten` | `#ffcf99` | Only inside the shader and the schedule visual, as lamp light |

Components never use those directly for text or backgrounds. They use semantic tokens — `bg`, `fg`,
`muted`, `faint`, `line`, `surface`, `accent`, `accent-text`, `on-accent` — which each **surface** class
redefines for its subtree:

- `surface-dark` — always the stage (hero, contact, footer)
- `surface-invert` — whatever contrasts with the page (about, services)
- `surface-paper` — always paper (a project card)
- `surface-ember` — the accent as a background (off script, a project card, the ticker)

The **house lights** switch in the nav flips the page between dark and light. The stage stays dark either
way. The change opens as an iris from the switch using the View Transitions API.

`accent-text` is a separate token from `accent` because pure ember does not reach AA as text on paper; on
light surfaces it deepens to `#c2330a`.

## Type

| Face | Use |
|---|---|
| **Archivo** variable (width 62–125, weight 100–900) | Everything. At width 62 / weight 900 it is the poster face (`t-poster`); at 125 / 800 it is the wide face for role and service titles (`t-wide`); at normal width it is body text. |
| **Fraunces** italic, optical size 144 | The voice. Kickers and the one phrase in each headline that should be heard (`t-serif`). |
| **Martian Mono**, condensed | Cue-sheet labels: section numbers, dates, metadata (`t-label`). |

One family doing three jobs keeps the font payload small and is what makes the hero possible: the width
axis is animated per letter.

## Motion

Motion is the content here, so it follows rules:

1. **Each section has one main move.** Nothing competes with it.
2. **Springs for things you push, curves for things that arrive.** Cursor, magnets, drag and the spotlight
   are springs. Reveals use one expo curve (`EXPO` in `src/lib/ease.ts`).
3. **Scroll is a scrubber.** Wherever possible, progress is tied to scroll position rather than a timer, so
   it can be reversed and re-read.
4. **Cheap properties only.** Transforms, opacity and clip-path. The one exception is the hero name, which
   animates a font axis on twelve glyphs — deliberate, and measured.

### Inventory

| Where | What moves |
|---|---|
| Preloader | Counter and cue reel, then an iris opening on the stage |
| Hero | WebGL follow-spot with haze and dust; name letters widen and light up under it; lamp-strike flicker; role reel; rotating seal; the stage sinks back as the next section rises over it |
| Seam | Two ticker tapes crossing in opposite directions, driven by scroll speed |
| About | Statement fills in word by word with scroll; portrait wipes in and parallaxes; stats count up |
| Work | Cards pin and stack, each shrinking under the next; four live visuals (re-planning schedule, sprint board, tilting phone, typewriter) |
| Lists | Rows flood with ember; image previews trail the pointer |
| Services | Accordion; a pinned strip that turns vertical scroll into sideways travel |
| Experience | Timeline drawn by scroll |
| Off script | Prints dealt onto the table, draggable with inertia |
| Stack | Outlined poster-type marquee |
| Contact | Fields light from the left on focus; confetti on send |
| Everywhere | Custom cursor, magnetic buttons, rolling link labels, masked heading reveals, film grain, nav that docks into a pill |

### Reduced motion

`prefers-reduced-motion` turns off smooth scroll, parallax, pinning, tickers, loops, the custom cursor and
the preloader. The hero draws one lit frame. Nothing is hidden behind an animation that will not play.

## Layout

- One fluid shell: `clamp(1.25rem, 4vw, 4rem)` side padding, capped at 120rem.
- Display type is sized in viewport units and clamped, so headlines fill the width at every size.
- Below 1024px the stacked cards and the pinned strip become ordinary flow and a swipe row; below 768px
  the draggable prints become a swipe row.
- The hero sizes to its content. If it is taller than the screen it scrolls to its end before pinning.

## Decisions worth knowing

- **Why no photos of the plants.** The scheduler is shown as a tiny scheduler instead: twelve jobs
  greedily packed into five lines with a changeover gap, re-planned on a timer or on click.
- **Why raw WebGL.** One full-screen shader does not need a 3D engine. It is about 100 lines of GLSL,
  drawn at 62% resolution, and falls back to a CSS gradient if WebGL is unavailable.
- **Why the name has an invisible "ruler" copy.** Letter positions are measured from a copy that never
  changes width, so the kinetic layers can stretch without triggering a measure–write loop or reflowing
  the page around them.
