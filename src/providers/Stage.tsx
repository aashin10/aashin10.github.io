import { createContext, useContext, type ReactNode } from 'react'

// "Curtain up": false while the preloader covers the page, true once it has
// opened. Entrance animations wait for it so nothing plays behind the curtain.
const StageContext = createContext(false)

export function StageProvider({ ready, children }: { ready: boolean; children: ReactNode }) {
  return <StageContext.Provider value={ready}>{children}</StageContext.Provider>
}

export const useCurtainUp = () => useContext(StageContext)
