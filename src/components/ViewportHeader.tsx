import { DeviceSelector } from '@/components/DeviceSelector'
import { ZoomControl } from '@/components/ZoomControl'
import { getPresetById } from '@/data/devices'
import { useViewportStore } from '@/store/viewport-store'
import { CUSTOM_DEVICE_ID, type Viewport } from '@/types/viewport'
import { formatSize } from '@/utils/viewport-utils'
import { FaIcon } from '@/lib/icons'
import {
  faBookmark,
  faChevronDown,
  faCopy,
  faRotate,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

interface ViewportHeaderProps {
  viewport: Viewport
}

export function ViewportHeader({ viewport }: ViewportHeaderProps) {
  const customPresets = useViewportStore((state) => state.customPresets)
  const updateViewport = useViewportStore((state) => state.updateViewport)
  const removeViewport = useViewportStore((state) => state.removeViewport)
  const duplicateViewport = useViewportStore((state) => state.duplicateViewport)
  const addCustomPreset = useViewportStore((state) => state.addCustomPreset)
  const [menuOpen, setMenuOpen] = useState(false)
  const [editingSize, setEditingSize] = useState(false)
  const [widthInput, setWidthInput] = useState(String(viewport.width))
  const [heightInput, setHeightInput] = useState(String(viewport.height))

  const applyDevice = (deviceId: string) => {
    setMenuOpen(false)
    if (deviceId === CUSTOM_DEVICE_ID) {
      setEditingSize(true)
      setWidthInput(String(viewport.width))
      setHeightInput(String(viewport.height))
      updateViewport(viewport.id, {
        deviceId: CUSTOM_DEVICE_ID,
        name: 'Custom',
      })
      return
    }
    const preset = getPresetById(deviceId, customPresets)
    if (!preset) return
    updateViewport(viewport.id, {
      deviceId: preset.id,
      name: preset.name,
      width: preset.width,
      height: preset.height,
      dpr: preset.dpr,
      orientation: 'portrait',
    })
  }

  const commitSize = () => {
    const width = Math.max(200, Number(widthInput) || viewport.width)
    const height = Math.max(120, Number(heightInput) || viewport.height)
    updateViewport(viewport.id, {
      width,
      height,
      deviceId: CUSTOM_DEVICE_ID,
      name: 'Custom',
      orientation: width <= height ? 'portrait' : 'landscape',
    })
    setEditingSize(false)
  }

  const rotate = () => {
    updateViewport(viewport.id, {
      width: viewport.height,
      height: viewport.width,
      orientation: viewport.orientation === 'portrait' ? 'landscape' : 'portrait',
    })
  }

  return (
    <div className="mresp-drag-handle relative flex h-9 shrink-0 items-center gap-1 border-b border-[#3c3c3c] bg-[#252526] px-1.5">
      <div className="relative min-w-0 flex-1">
        <button
          type="button"
          className="mresp-drag-handle-ignore flex max-w-full items-center gap-0.5 truncate rounded px-1 py-0.5 text-left hover:bg-[#333]"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span className="truncate">{viewport.name}</span>
          <FaIcon icon={faChevronDown} size={12} className="shrink-0 text-[#8d8d8d]" />
        </button>
        {menuOpen && (
          <DeviceSelector
            currentId={viewport.deviceId}
            onSelect={applyDevice}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </div>

      {editingSize ? (
        <form
          className="mresp-drag-handle-ignore flex items-center gap-1"
          onSubmit={(event) => {
            event.preventDefault()
            commitSize()
          }}
        >
          <input
            value={widthInput}
            onChange={(event) => setWidthInput(event.target.value)}
            className="h-6 w-12 rounded border border-[#3c3c3c] bg-[#1f1f1f] px-1 text-center outline-none"
            aria-label="Width"
          />
          <span className="text-[#8d8d8d]">×</span>
          <input
            value={heightInput}
            onChange={(event) => setHeightInput(event.target.value)}
            className="h-6 w-12 rounded border border-[#3c3c3c] bg-[#1f1f1f] px-1 text-center outline-none"
            aria-label="Height"
          />
          <button
            type="submit"
            className="h-6 rounded bg-[#0e639c] px-1.5 text-white hover:bg-[#1177bb]"
          >
            Set
          </button>
        </form>
      ) : (
        <button
          type="button"
          className="mresp-drag-handle-ignore rounded px-1 py-0.5 text-[#c6c6c6] hover:bg-[#333]"
          title="Edit size"
          onClick={() => {
            setWidthInput(String(viewport.width))
            setHeightInput(String(viewport.height))
            setEditingSize(true)
          }}
        >
          {formatSize(viewport.width, viewport.height)}
        </button>
      )}

      <ZoomControl
        zoom={viewport.zoom}
        onChange={(zoom) => updateViewport(viewport.id, { zoom })}
      />

      <button
        type="button"
        className="mresp-drag-handle-ignore inline-flex h-6 w-6 items-center justify-center rounded text-[#c6c6c6] hover:bg-[#333]"
        title="Rotate"
        onClick={rotate}
      >
        <FaIcon icon={faRotate} size={13} />
      </button>
      <button
        type="button"
        className="mresp-drag-handle-ignore inline-flex h-6 w-6 items-center justify-center rounded text-[#c6c6c6] hover:bg-[#333]"
        title="Duplicate"
        onClick={() => duplicateViewport(viewport.id)}
      >
        <FaIcon icon={faCopy} size={13} />
      </button>
      <button
        type="button"
        className="mresp-drag-handle-ignore inline-flex h-6 w-6 items-center justify-center rounded text-[#c6c6c6] hover:bg-[#333]"
        title="Save as preset"
        onClick={() =>
          addCustomPreset(
            `${viewport.name} ${viewport.width}×${viewport.height}`,
            viewport.width,
            viewport.height,
            viewport.dpr,
          )
        }
      >
        <FaIcon icon={faBookmark} size={13} />
      </button>
      <button
        type="button"
        className="mresp-drag-handle-ignore inline-flex h-6 w-6 items-center justify-center rounded text-[#c6c6c6] hover:bg-[#5a1d1d] hover:text-white"
        title="Close"
        onClick={() => removeViewport(viewport.id)}
      >
        <FaIcon icon={faXmark} size={14} />
      </button>
    </div>
  )
}
