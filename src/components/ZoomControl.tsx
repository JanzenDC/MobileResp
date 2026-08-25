import { ZOOM_OPTIONS } from '@/types/viewport'
import { formatZoom } from '@/utils/viewport-utils'
import { FaIcon } from '@/lib/icons'
import { faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'

interface ZoomControlProps {
  zoom: number
  onChange: (zoom: number) => void
}

export function ZoomControl({ zoom, onChange }: ZoomControlProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const node = rootRef.current
    if (!node) return
    const root = node.getRootNode()
    const onPointerDown = (event: Event) => {
      if (!node.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    root.addEventListener('pointerdown', onPointerDown, true)
    return () => root.removeEventListener('pointerdown', onPointerDown, true)
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="mresp-drag-handle-ignore inline-flex h-6 items-center gap-1 rounded px-1.5 text-[#c6c6c6] hover:bg-[#333]"
        title="Zoom"
        onClick={() => setOpen((value) => !value)}
      >
        <FaIcon icon={faMagnifyingGlassPlus} size={12} />
        <span>{formatZoom(zoom)}</span>
      </button>
      {open && (
        <div className="absolute top-[calc(100%+4px)] right-0 z-20 w-[84px] rounded border border-[#3c3c3c] bg-[#252525] py-1 shadow-xl">
          {ZOOM_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`block w-full px-2.5 py-1 text-left hover:bg-[#2f2f2f] ${
                option === zoom ? 'text-white' : ''
              }`}
              onClick={() => {
                onChange(option)
                setOpen(false)
              }}
            >
              {formatZoom(option)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
