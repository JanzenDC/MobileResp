import { groupedPresets } from '@/data/devices'
import { useViewportStore } from '@/store/viewport-store'
import { CUSTOM_DEVICE_ID } from '@/types/viewport'
import { formatSize } from '@/utils/viewport-utils'
import { useEffect, useRef } from 'react'

interface DeviceSelectorProps {
  currentId: string
  onSelect: (deviceId: string) => void
  onClose: () => void
}

export function DeviceSelector({ currentId, onSelect, onClose }: DeviceSelectorProps) {
  const customPresets = useViewportStore((state) => state.customPresets)
  const removeCustomPreset = useViewportStore((state) => state.removeCustomPreset)
  const groups = groupedPresets(customPresets)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    const root = node.getRootNode()
    const onPointerDown = (event: Event) => {
      const target = event.target as Node | null
      if (target && !node.contains(target)) onClose()
    }
    root.addEventListener('pointerdown', onPointerDown, true)
    return () => root.removeEventListener('pointerdown', onPointerDown, true)
  }, [onClose])

  return (
    <div
      ref={rootRef}
      className="absolute top-[calc(100%+4px)] left-1 z-20 w-56 max-h-72 overflow-auto rounded border border-[#3c3c3c] bg-[#252525] py-1 shadow-xl"
    >
      <Section
        label="Mobile"
        devices={groups.mobile}
        currentId={currentId}
        onSelect={onSelect}
      />
      <Section
        label="Tablet"
        devices={groups.tablet}
        currentId={currentId}
        onSelect={onSelect}
      />
      <Section
        label="Desktop"
        devices={groups.desktop}
        currentId={currentId}
        onSelect={onSelect}
      />
      {groups.custom.length > 0 && (
        <Section
          label="Custom"
          devices={groups.custom}
          currentId={currentId}
          onSelect={onSelect}
          onDelete={removeCustomPreset}
        />
      )}
      <button
        type="button"
        className="flex w-full items-center justify-between px-2.5 py-1.5 text-left hover:bg-[#2f2f2f]"
        onClick={() => onSelect(CUSTOM_DEVICE_ID)}
      >
        <span>Custom size…</span>
      </button>
    </div>
  )
}

function Section({
  label,
  devices,
  currentId,
  onSelect,
  onDelete,
}: {
  label: string
  devices: { id: string; name: string; width: number; height: number }[]
  currentId: string
  onSelect: (id: string) => void
  onDelete?: (id: string) => void
}) {
  return (
    <div className="pb-1">
      <div className="px-2.5 pt-1.5 pb-1 text-[10px] uppercase tracking-wide text-[#8d8d8d]">
        {label}
      </div>
      {devices.map((device) => (
        <div key={device.id} className="flex items-center hover:bg-[#2f2f2f]">
          <button
            type="button"
            className={`flex min-w-0 flex-1 items-center justify-between px-2.5 py-1 text-left ${
              device.id === currentId ? 'text-white' : 'text-[#d4d4d4]'
            }`}
            onClick={() => onSelect(device.id)}
          >
            <span className="truncate">{device.name}</span>
            <span className="ml-2 shrink-0 text-[#8d8d8d]">{formatSize(device.width, device.height)}</span>
          </button>
          {onDelete && (
            <button
              type="button"
              className="px-2 text-[#8d8d8d] hover:text-[#f1f1f1]"
              onClick={() => onDelete(device.id)}
              aria-label={`Delete ${device.name}`}
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
