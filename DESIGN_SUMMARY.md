# AI Agent — Website Design Summary

## Brief Summary

A dark, modern portfolio site for an AI agent that highlights 3D-led branding, curated projects, professional experience, and an easy contact flow. Built with React, Vite, TailwindCSS, Three.js and Framer Motion for a polished, interactive experience.

## Color Palette

- **Primary:** #011825 — deep midnight teal (site background, primary surfaces)
- **Secondary:** #F0EFEB — soft off-white (text highlights, subtle surfaces)
- **Tertiary:** #0D3056 — deep blue (headings, section anchors)
- **Quaternary (Accent):** #1689C8 — bright cyan/blue (buttons, links, CTAs)
- **Accent/Glow:** gradient used by `.streaky-glow` (white → warm gold → cyan) for special headings and micro-glow effects

These tokens are defined in `tailwind.config.cjs` and used throughout the UI.

## Typography

- Global body font: `Montserrat` (set in `src/index.css`)
- Heading font import available: `Poppins` (imported and used selectively)
- Size tokens: Tailwind custom sizes include `title: 2rem` and `subtitle: 1.5rem` for consistent scale.

## Main Sections

- **Navbar:** compact, transparent over the hero; anchor navigation and responsive collapse for small screens.
- **Hero:** full-viewport banner with parallax background image, large headline with rotating text animation, 3D `Spaceman` model and primary CTA.
- **Portfolio / Projects:** grid of project cards with rounded images, hover tilt/elevation and short descriptions; click-through to details or external links.
- **Experience:** vertical timeline presenting roles and dates (uses `react-vertical-timeline-component`).
- **Contact:** simple contact form backed by EmailJS with success/failure states and clear inputs.
- **Loader / Transitions:** full-screen loader while 3D assets initialize; smooth entrance/exit transitions across sections.

## Design Philosophy

- Dark-first, high-contrast accents to draw attention to CTAs and important content.
- Depth & motion: combine parallax, subtle shadows, and 3D elements to create hierarchy without clutter.
- Minimal content, clear calls-to-action, and readable typography for fast comprehension.
- Friendly, slightly playful branding (the Spaceman) to humanize a technical portfolio.

## UI Elements & Interactions

- Buttons: rounded, quaternary-accent fills with hover brighten and subtle shadow.
- Cards: glass-like panels with rounded corners (15px), gentle elevation on hover.
- Text effects: `streaky-glow` gradient headings and `textRotate` keyframe animations for dynamic headlines.
- Animations: `framer-motion` for UI transitions, `GSAP` + Three.js/`maath` for 3D motion, `react-tilt` for card tilt effects.
- Accessibility: focus states, aria labels on interactive elements, and semantic sections are prioritized.

## Implementation Notes

- Tech stack: React + Vite, TailwindCSS, Framer Motion, Three.js (react-three-fiber + drei), GSAP, EmailJS.
- Tailwind tokens in `tailwind.config.cjs` (colors, keyframes, breakpoints) centralize styling values.
- Parallax and background art live under `public/parallax/` and `src/assets/` (see `hero-pattern`).
- Keep 3D canvas ARIA-hidden for assistive tech when non-essential; provide a short text alternative.

## Next Steps / Recommendations

- Add CSS variables for color tokens to simplify runtime theming.
- Run an accessibility contrast audit and tune accent usage for small-text contrast.
- Provide alt text for hero and project images and explicit aria roles for the canvas.

---

File generated: `DESIGN_SUMMARY.md`
