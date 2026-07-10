import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ShareItem from './components/ShareItem.tsx'
import { LanguageProvider } from './i18n.tsx'

// Lightweight path-based routing (no react-router). A shared Secondhand
// listing lives at /s/<listingId>; everything else is the marketing site.
const shareMatch = window.location.pathname.match(/^\/s\/([^/]+)$/)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {shareMatch ? (
      <ShareItem id={decodeURIComponent(shareMatch[1])} />
    ) : (
      <LanguageProvider>
        <App />
      </LanguageProvider>
    )}
  </StrictMode>,
)
