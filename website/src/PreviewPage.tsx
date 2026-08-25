import { useEffect } from 'react'
import { LivePreview } from './LivePreview'
import { SiteHeader } from './SiteHeader'

export function PreviewPage() {
  useEffect(() => {
    document.title = 'Preview · MobileResp'
  }, [])

  return (
    <div className="flex min-h-dvh flex-col bg-ink text-mist font-sans">
      <SiteHeader current="preview" />
      <LivePreview layout="page" />
    </div>
  )
}
