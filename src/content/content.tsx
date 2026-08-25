import { overlayInteracting } from '@/lib/interaction'
import { OverlayApp } from '@/overlay/OverlayApp'
import { isRuntimeMessage } from '@/lib/messages'
import { hydrateStore, listenStorageSync } from '@/store/viewport-store'
import { HOST_ID } from '@/types/viewport'
import overlayCss from '@/styles/overlay.css?inline'
import { StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'

let root: Root | undefined
let listening = false
let attaching = false

function isTopWindow(): boolean {
  try {
    return window.self === window.top
  } catch {
    return window.parent === window
  }
}

function injectStyles(shadow: ShadowRoot) {
  const existing = shadow.querySelector('style[data-mresp]')
  if (existing) existing.remove()
  const style = document.createElement('style')
  style.dataset.mresp = 'true'
  style.textContent = overlayCss
  shadow.appendChild(style)
}

function applyHostStyles(host: HTMLElement) {
  host.setAttribute('popover', 'manual')
  const styles: Record<string, string> = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
    margin: '0px',
    padding: '0px',
    border: '0px',
    width: '100vw',
    height: '100vh',
    maxWidth: 'none',
    maxHeight: 'none',
    overflow: 'visible',
    background: 'transparent',
    pointerEvents: 'none',
    zIndex: '2147483647',
    display: 'block',
  }
  for (const [property, value] of Object.entries(styles)) {
    host.style.setProperty(property, value, 'important')
  }
}

function revealHost(host: HTMLElement) {
  if (overlayInteracting) return
  if (!host.isConnected || host.parentElement !== document.documentElement) {
    document.documentElement.appendChild(host)
  }
  if (typeof host.showPopover === 'function' && !host.matches(':popover-open')) {
    try {
      host.showPopover()
    } catch {
      // Some pages reject popover; fixed positioning still applies.
    }
  }
}

function ensureHost(): { host: HTMLElement; mountPoint: HTMLElement } {
  let host = document.getElementById(HOST_ID)
  if (!host) {
    host = document.createElement('div')
    host.id = HOST_ID
  }
  applyHostStyles(host)

  const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' })
  injectStyles(shadow)

  let mountPoint = shadow.getElementById('mresp-root')
  if (!mountPoint) {
    mountPoint = document.createElement('div')
    mountPoint.id = 'mresp-root'
    Object.assign(mountPoint.style, {
      position: 'fixed',
      inset: '0px',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    })
    shadow.appendChild(mountPoint)
  }

  revealHost(host)
  return { host, mountPoint }
}

function watchHost(host: HTMLElement) {
  if (attaching) return
  attaching = true
  const observer = new MutationObserver(() => revealHost(host))
  observer.observe(document.documentElement, { childList: true })
  document.addEventListener('visibilitychange', () => revealHost(host))
}

async function mount() {
  if (!isTopWindow()) return

  await hydrateStore()
  if (!listening) {
    listenStorageSync()
    listening = true
  }

  const { host, mountPoint } = ensureHost()
  watchHost(host)

  if (!root) {
    root = createRoot(mountPoint)
    root.render(
      <StrictMode>
        <OverlayApp />
      </StrictMode>,
    )
  }
}

void mount().catch((error) => {
  console.error('[MobileResp] overlay mount failed', error)
})

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!isRuntimeMessage(message)) return
  void mount()
    .then(() => sendResponse({ ok: true }))
    .catch((error: unknown) => {
      console.error('[MobileResp] overlay mount failed', error)
      sendResponse({ ok: false })
    })
  return true
})
