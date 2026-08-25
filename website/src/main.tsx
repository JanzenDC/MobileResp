import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { PreviewPage } from './PreviewPage'
import './index.css'

const preview = window.location.pathname.replace(/\/$/, '') === '/preview'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {preview ? <PreviewPage /> : <App />}
  </StrictMode>,
)
