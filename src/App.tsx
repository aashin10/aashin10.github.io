import { MotionConfig } from 'motion/react'
import { startTransition, useEffect, useState } from 'react'
import { Cursor } from './components/core/Cursor'
import { Nav } from './components/layout/Nav'
import { Preloader } from './components/layout/Preloader'
import { Footer } from './components/layout/Footer'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Experience } from './components/sections/Experience'
import { Hero } from './components/sections/Hero'
import { OffScript } from './components/sections/OffScript'
import { Services } from './components/sections/Services'
import { Stack } from './components/sections/Stack'
import { Work } from './components/sections/Work'
import { SmoothScroll } from './providers/SmoothScroll'
import { StageProvider } from './providers/Stage'
import { ThemeProvider } from './providers/Theme'

export default function App() {
  const [curtainUp, setCurtainUp] = useState(false)

  // The curtain covers the page for the first couple of seconds, so everything
  // below the hero is mounted a beat after first paint, as a transition. React
  // then renders it in small slices and the opening animation stays smooth.
  const [belowFold, setBelowFold] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => startTransition(() => setBelowFold(true)), 80)
    return () => window.clearTimeout(id)
  }, [])

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
                {belowFold && <About />}
              </div>
              {belowFold && (
                <>
                  <Work />
                  <Services />
                  <Experience />
                  <OffScript />
                  <Stack />
                  <Contact />
                </>
              )}
            </main>
            {belowFold && <Footer />}
            <Cursor />
            <div className="grain" aria-hidden />
          </StageProvider>
        </SmoothScroll>
      </ThemeProvider>
    </MotionConfig>
  )
}
