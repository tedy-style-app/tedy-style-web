import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ShareItem from './components/ShareItem.tsx'
import AdminApp from './admin/AdminApp.tsx'
import { LanguageProvider } from './i18n.tsx'

// Lightweight path-based routing (no react-router):
//   /admin[...]  -> admin panel
//   /s/<id>      -> shared Secondhand listing
//   everything else -> the marketing site
const path = window.location.pathname
const isAdmin = path === '/admin' || path.startsWith('/admin/')
const shareMatch = path.match(/^\/s\/([^/]+)$/)

function Root() {
  if (isAdmin) return <AdminApp />
  if (shareMatch) return <ShareItem id={decodeURIComponent(shareMatch[1])} />
  return (
    <LanguageProvider>
      <App />
    </LanguageProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
