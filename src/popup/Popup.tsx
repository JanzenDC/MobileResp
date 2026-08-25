import { DEFAULT_DEVICE_ID, DEVICE_PRESETS } from '@/data/devices'
import { useViewportStore } from '@/store/viewport-store'
import { formatSize } from '@/utils/viewport-utils'
import { FaIcon } from '@/lib/icons'
import {
  faDesktop,
  faMobileScreen,
  faPlus,
  faTabletScreenButton,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'

type PageStatus = 'checking' | 'ready' | 'restricted' | 'missing'

export function Popup() {
  const hydrated = useViewportStore((state) => state.hydrated)
  const enabled = useViewportStore((state) => state.enabled)
  const viewports = useViewportStore((state) => state.viewports)
  const customPresets = useViewportStore((state) => state.customPresets)
  const addViewport = useViewportStore((state) => state.addViewport)
  const removeViewport = useViewportStore((state) => state.removeViewport)
  const duplicateViewport = useViewportStore((state) => state.duplicateViewport)
  const clearAll = useViewportStore((state) => state.clearAll)
  const setEnabled = useViewportStore((state) => state.setEnabled)
  const addCustomPreset = useViewportStore((state) => state.addCustomPreset)
  const [deviceId, setDeviceId] = useState(DEFAULT_DEVICE_ID)
  const [status, setStatus] = useState<PageStatus>('checking')
  const [customWidth, setCustomWidth] = useState('390')
  const [customHeight, setCustomHeight] = useState('844')
  const [customName, setCustomName] = useState('')

  useEffect(() => {
    let cancelled = false

    async function detect() {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      const url = tab?.url ?? ''
      if (!tab?.id || !/^https?:/i.test(url)) {
        if (!cancelled) setStatus('restricted')
        return
      }
      try {
        await chrome.tabs.sendMessage(tab.id, { type: 'PING' })
        if (!cancelled) setStatus('ready')
      } catch {
        if (!cancelled) setStatus('missing')
      }
    }

    void detect()
    return () => {
      cancelled = true
    }
  }, [])

  const blocked = status !== 'ready'

  return (
    <div className="w-[320px] p-3">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[13px] font-semibold text-white">MobileResp</h1>
          <p className="text-[#8d8d8d]">Floating viewports on this page</p>
        </div>
        <label className="flex items-center gap-1.5 text-[#c6c6c6]">
          <input
            type="checkbox"
            checked={enabled}
            disabled={!hydrated}
            onChange={(event) => setEnabled(event.target.checked)}
          />
          Overlay
        </label>
      </div>

      {status === 'restricted' && (
        <p className="mb-3 rounded border border-[#5a3e1b] bg-[#2a2116] px-2 py-1.5 text-[#e0c08c]">
          This page cannot host viewports (browser or store pages).
        </p>
      )}
      {status === 'missing' && (
        <p className="mb-3 rounded border border-[#5a3e1b] bg-[#2a2116] px-2 py-1.5 text-[#e0c08c]">
          Reload the tab, then try again.
        </p>
      )}

      <div className="mb-2 flex gap-2">
        <select
          className="h-8 min-w-0 flex-1 rounded border border-[#3c3c3c] bg-[#252525] px-2 outline-none"
          value={deviceId}
          onChange={(event) => setDeviceId(event.target.value)}
        >
          <optgroup label="Mobile">
            {DEVICE_PRESETS.filter((device) => device.category === 'mobile').map((device) => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Tablet">
            {DEVICE_PRESETS.filter((device) => device.category === 'tablet').map((device) => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Desktop">
            {DEVICE_PRESETS.filter((device) => device.category === 'desktop').map((device) => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </optgroup>
          {customPresets.length > 0 && (
            <optgroup label="Custom">
              {customPresets.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        <button
          type="button"
          className="inline-flex h-8 items-center gap-1 rounded bg-[#0e639c] px-2.5 text-white hover:bg-[#1177bb] disabled:opacity-50"
          disabled={blocked}
          onClick={() => addViewport(deviceId)}
        >
          <FaIcon icon={faPlus} size={14} />
          Add
        </button>
      </div>

      <div className="mb-3 rounded border border-[#3c3c3c] bg-[#202020] p-2">
        <div className="mb-1.5 text-[10px] uppercase tracking-wide text-[#8d8d8d]">
          Save custom preset
        </div>
        <div className="flex gap-1.5">
          <input
            className="h-7 min-w-0 flex-1 rounded border border-[#3c3c3c] bg-[#1a1a1a] px-1.5 outline-none"
            placeholder="Name"
            value={customName}
            onChange={(event) => setCustomName(event.target.value)}
          />
          <input
            className="h-7 w-14 rounded border border-[#3c3c3c] bg-[#1a1a1a] px-1.5 text-center outline-none"
            value={customWidth}
            onChange={(event) => setCustomWidth(event.target.value)}
            aria-label="Width"
          />
          <input
            className="h-7 w-14 rounded border border-[#3c3c3c] bg-[#1a1a1a] px-1.5 text-center outline-none"
            value={customHeight}
            onChange={(event) => setCustomHeight(event.target.value)}
            aria-label="Height"
          />
          <button
            type="button"
            className="h-7 rounded border border-[#3c3c3c] px-2 hover:bg-[#2f2f2f]"
            onClick={() => {
              const width = Number(customWidth)
              const height = Number(customHeight)
              if (!customName.trim() || !width || !height) return
              addCustomPreset(customName.trim(), width, height, 1)
              setCustomName('')
            }}
          >
            Save
          </button>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[11px] uppercase tracking-wide text-[#8d8d8d]">Active viewports</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-[#c6c6c6] hover:text-white disabled:opacity-40"
          disabled={viewports.length === 0}
          onClick={() => clearAll()}
        >
          <FaIcon icon={faTrash} size={12} />
          Clear all
        </button>
      </div>

      {viewports.length === 0 ? (
        <p className="rounded border border-dashed border-[#3c3c3c] px-2 py-4 text-center text-[#8d8d8d]">
          No viewports yet
        </p>
      ) : (
        <ul className="max-h-56 space-y-1 overflow-auto">
          {viewports.map((viewport) => (
            <li
              key={viewport.id}
              className="flex items-center gap-2 rounded border border-[#333] bg-[#242424] px-2 py-1.5"
            >
              <CategoryIcon deviceId={viewport.deviceId} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-white">{viewport.name}</div>
                <div className="text-[#8d8d8d]">{formatSize(viewport.width, viewport.height)}</div>
              </div>
              <button
                type="button"
                className="text-[#8d8d8d] hover:text-white"
                onClick={() => duplicateViewport(viewport.id)}
              >
                Duplicate
              </button>
              <button
                type="button"
                className="text-[#8d8d8d] hover:text-white"
                onClick={() => removeViewport(viewport.id)}
              >
                Close
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function CategoryIcon({ deviceId }: { deviceId: string }) {
  const className = 'shrink-0 text-[#8d8d8d]'
  if (deviceId.includes('ipad') || deviceId.includes('tablet')) {
    return <FaIcon icon={faTabletScreenButton} size={14} className={className} />
  }
  if (deviceId.includes('desktop')) {
    return <FaIcon icon={faDesktop} size={14} className={className} />
  }
  return <FaIcon icon={faMobileScreen} size={14} className={className} />
}
