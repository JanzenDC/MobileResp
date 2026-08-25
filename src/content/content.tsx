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
  if (host.hasAttribute('popover') && typeof host.hidePopover === 'function') {
    try {
      if (host.matches(':popover-open')) host.hidePopover()
    } catch {
      // ignore
    }
    host.removeAttribute('popover')
  }

  const styles: Record<string, string> = {
    position: 'fixed',
    top: '0px',
    left: '0px',
    width: '0px',
    height: '0px',
    margin: '0px',
    padding: '0px',
    border: '0px',
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

function attachHost(host: HTMLElement) {
  if (!host.isConnected || host.parentElement !== document.documentElement) {
    document.documentElement.appendChild(host)
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
    shadow.appendChild(mountPoint)
  }
  Object.assign(mountPoint.style, {
    position: 'fixed',
    top: '0px',
    left: '0px',
    width: '0px',
    height: '0px',
    overflow: 'visible',
    pointerEvents: 'none',
  })

  attachHost(host)
  return { host, mountPoint }
}

function watchHost(host: HTMLElement) {
  if (attaching) return
  attaching = true
  const observer = new MutationObserver(() => attachHost(host))
  observer.observe(document.documentElement, { childList: true })
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
