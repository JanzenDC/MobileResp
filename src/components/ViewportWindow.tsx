import { ViewportHeader } from '@/components/ViewportHeader'
import { setOverlayInteracting } from '@/lib/interaction'
import { useViewportStore } from '@/store/viewport-store'
import { CUSTOM_DEVICE_ID, HEADER_HEIGHT } from '@/types/viewport'
import { cssSizeFromFrame, visualFrameSize } from '@/utils/viewport-utils'
import { useEffect, useState } from 'react'
import { Rnd } from 'react-rnd'

interface ViewportWindowProps {
  id: string
  pageUrl: string
}

export function ViewportWindow({ id, pageUrl }: ViewportWindowProps) {
  const viewport = useViewportStore((state) =>
    state.viewports.find((item) => item.id === id),
  )
  const updateViewport = useViewportStore((state) => state.updateViewport)
  const bringToFront = useViewportStore((state) => state.bringToFront)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const [interacting, setInteracting] = useState(false)

  useEffect(() => {
    setLoaded(false)
    setFailed(false)
  }, [pageUrl])

  if (!viewport) return null

  const frame = visualFrameSize(viewport.width, viewport.height, viewport.zoom)

  const beginInteract = () => {
    setOverlayInteracting(true)
    setInteracting(true)
    bringToFront(id)
  }

  const endInteract = () => {
    setOverlayInteracting(false)
    setInteracting(false)
  }

  return (
    <Rnd
      key={`${id}-${viewport.deviceId}-${viewport.orientation}-${viewport.zoom}`}
      className="mresp-window"
      style={{
        zIndex: viewport.zIndex,
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        background: '#1f1f1f',
        border: '1px solid #3c3c3c',
        borderRadius: 6,
        boxShadow: '0 14px 40px rgba(0,0,0,0.42)',
        overflow: 'hidden',
      }}
      default={{
        x: viewport.x,
        y: viewport.y,
        width: frame.width,
        height: frame.height + HEADER_HEIGHT,
      }}
      minWidth={Math.round(200 * viewport.zoom)}
      minHeight={Math.round(120 * viewport.zoom) + HEADER_HEIGHT}
      dragHandleClassName="mresp-drag-handle"
      cancel=".mresp-drag-handle-ignore"
      enableUserSelectHack={false}
      enableResizing={{
        bottom: true,
        right: true,
        bottomRight: true,
        top: false,
        left: false,
        topLeft: false,
        topRight: false,
        bottomLeft: false,
      }}
      onDragStart={beginInteract}
      onResizeStart={beginInteract}
      onDragStop={(_event, data) => {
        endInteract()
        updateViewport(id, { x: data.x, y: data.y })
      }}
      onResizeStop={(_event, _dir, ref, _delta, position) => {
        const next = cssSizeFromFrame(ref.offsetWidth, ref.offsetHeight, viewport.zoom)
        endInteract()
        updateViewport(id, {
          ...next,
          x: position.x,
          y: position.y,
          deviceId: CUSTOM_DEVICE_ID,
          name: 'Custom',
        })
      }}
    >
      <ViewportHeader viewport={viewport} />
      <div
        className="relative overflow-hidden bg-[#111]"
        style={{ width: '100%', flex: 1, minHeight: 0 }}
      >
        {!loaded && !failed && (
          <div className="absolute inset-0 z-[1] flex items-center justify-center text-[#8d8d8d]">
            Loading preview…
          </div>
        )}
        {failed && (
          <div className="absolute inset-0 z-[1] flex items-center justify-center p-4 text-center text-[#c6c6c6]">
            This page blocked being embedded. Header stripping may not apply here.
          </div>
        )}
        <iframe
          title={`${viewport.name} preview`}
          src={pageUrl}
          className="block origin-top-left bg-white"
          style={{
            width: viewport.width,
            height: viewport.height,
            maxWidth: 'none',
            maxHeight: 'none',
            transform: `scale(${viewport.zoom})`,
            border: 0,
            pointerEvents: interacting ? 'none' : 'auto',
          }}
          onLoad={(event) => {
            try {
              if (!event.currentTarget.contentDocument) {
                setFailed(true)
                return
              }
              setLoaded(true)
            } catch {
              setFailed(true)
            }
          }}
          onError={() => setFailed(true)}
        />
        {interacting && <div className="absolute inset-0 z-[2]" />}
      </div>
    </Rnd>
  )
}
