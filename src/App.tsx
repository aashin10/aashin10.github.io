import { MotionConfig } from 'motion/react'
import { useState } from 'react'
import { Cursor } from './components/core/Cursor'
import { Nav } from './components/layout/Nav'
import { Preloader } from './components/layout/Preloader'
import { Hero } from './components/sections/Hero'
import { SmoothScroll } from './providers/SmoothScroll'
import { StageProvider } from './providers/Stage'
import { ThemeProvider } from './providers/Theme'

export default function App() {
  const [curtainUp, setCurtainUp] = useState(false)

  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <SmoothScroll>
          <StageProvider ready={curtainUp}>
            <a
              href="#main"
              className="t-label fixed top-3 left-3 z-[110] -translate-y-20 rounded-full bg-accent px-4 py-3 text-on-accent focus-visible:translate-y-0"
            >
              Skip to content
            </a>
            <Preloader onOpen={() => setCurtainUp(true)} />
            <Nav />
            <main id="main">
              <div className="relative">
                <Hero />
                <section id="about" className="surface-invert relative z-10 min-h-[160vh] rounded-t-[2rem]">
                  <div className="shell py-32">placeholder</div>
                </section>
              </div>
            </main>
            <Cursor />
            <div className="grain" aria-hidden />
          </StageProvider>
        </SmoothScroll>
      </ThemeProvider>
    </MotionConfig>
  )
}
