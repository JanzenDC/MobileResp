import { ViewportWindow } from '@/components/ViewportWindow'
import { usePageUrl } from '@/hooks/usePageUrl'
import { useViewportStore } from '@/store/viewport-store'
import { useShallow } from 'zustand/react/shallow'

export function OverlayApp() {
  const hydrated = useViewportStore((state) => state.hydrated)
  const enabled = useViewportStore((state) => state.enabled)
  const viewportIds = useViewportStore(
    useShallow((state) => state.viewports.map((viewport) => viewport.id)),
  )
  const pageUrl = usePageUrl()

  if (!hydrated || !enabled) return null

  return (
    <div
      id="mresp-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {viewportIds.map((id) => (
        <ViewportWindow key={id} id={id} pageUrl={pageUrl} />
      ))}
    </div>
  )
}
