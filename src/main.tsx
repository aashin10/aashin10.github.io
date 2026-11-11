import '@fontsource-variable/archivo/wdth'
import '@fontsource-variable/fraunces/opsz-italic'
import '@fontsource-variable/martian-mono/wdth'
import './styles/globals.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
