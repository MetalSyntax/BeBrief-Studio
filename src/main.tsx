import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './lib/i18n'
import App from './App.tsx'
import { ToastProvider } from './components/shared/ToastProvider'
import { PWAUpdateBanner } from './components/shared/PWAUpdateBanner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <App />
      <PWAUpdateBanner />
    </ToastProvider>
  </StrictMode>,
)
