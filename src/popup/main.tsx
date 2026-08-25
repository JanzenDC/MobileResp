import { Popup } from '@/popup/Popup'
import { hydrateStore, listenStorageSync } from '@/store/viewport-store'
import '@/styles/popup.css'
import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

function Root() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    void hydrateStore().then(() => {
      listenStorageSync()
      setReady(true)
    })
  }, [])

  if (!ready) {
    return <div className="p-3 text-[#8d8d8d]">Loading…</div>
  }

  return <Popup />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
