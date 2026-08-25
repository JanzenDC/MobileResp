import { DeviceMobile, DeviceTablet, Play } from '@phosphor-icons/react'
import { useState } from 'react'
import { Rnd } from 'react-rnd'

const DEFAULT_URL = 'https://example.com'

function toHttpUrl(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const withProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)
    ? trimmed
    : `https://${trimmed}`
  try {
    const url = new URL(withProtocol)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url.toString()
  } catch {
    return null
  }
}

export function LivePreview() {
  const [draft, setDraft] = useState('example.com')
  const [url, setUrl] = useState(DEFAULT_URL)
  const [error, setError] = useState<string | null>(null)

  const runPreview = () => {
    const next = toHttpUrl(draft)
    if (!next) {
      setError('Enter a valid http or https address.')
      return
    }
    setError(null)
    setUrl(next)
  }

  return (
    <section id="preview" className="border-t border-white/10">
      <form
        className="flex flex-col gap-3 border-b border-white/10 px-5 py-6 lg:flex-row lg:items-end lg:px-10"
        onSubmit={(event) => {
          event.preventDefault()
          runPreview()
        }}
      >
        <label className="grid min-w-0 flex-1 gap-2">
          <span className="text-sm font-medium text-white">Website</span>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="example.com"
            autoComplete="url"
            inputMode="url"
            className="h-11 border border-white/20 bg-ink px-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-copper"
          />
        </label>
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-2 bg-copper px-5 text-sm font-semibold text-white hover:bg-copper-press active:scale-[0.98]"
        >
          <Play size={16} weight="fill" />
          Preview
        </button>
      </form>
      {error && <p className="px-5 pt-3 text-sm text-copper lg:px-10">{error}</p>}
      <p className="px-5 pt-4 text-sm text-white/50 lg:px-10">
        Drag the frame headers. Some sites block iframes here. The extension can still open those.
      </p>
      <div className="relative mt-4 h-[640px] overflow-hidden bg-[#141414] md:h-[720px]">
        <iframe
          title="Preview page"
          src={url}
          key={`page-${url}`}
          className="absolute inset-0 h-full w-full border-0 bg-white"
        />
        <PreviewFrame
          name="iPhone 15"
          width={393}
          height={852}
          zoom={0.42}
          x={28}
          y={36}
          url={url}
        />
        <PreviewFrame
          name="iPad"
          width={768}
          height={1024}
          zoom={0.32}
          x={220}
          y={72}
          url={url}
        />
      </div>
    </section>
  )
}

function PreviewFrame({
  name,
  width,
  height,
  zoom,
  x,
  y,
  url,
}: {
  name: string
  width: number
  height: number
  zoom: number
  x: number
  y: number
  url: string
}) {
  const visualW = Math.round(width * zoom)
  const visualH = Math.round(height * zoom)
  const header = 32
  const Icon = name.includes('iPad') ? DeviceTablet : DeviceMobile

  return (
    <Rnd
      default={{ x, y, width: visualW, height: visualH + header }}
      minWidth={140}
      minHeight={180}
      bounds="parent"
      dragHandleClassName="preview-drag"
      enableUserSelectHack={false}
      enableResizing={false}
      style={{
        pointerEvents: 'auto',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        background: '#1f1f1f',
        border: '1px solid #3c3c3c',
        boxShadow: '0 18px 40px rgb(0 0 0 / 0.45)',
        overflow: 'hidden',
      }}
    >
      <div className="preview-drag flex h-8 shrink-0 cursor-move items-center gap-2 border-b border-white/10 px-2 text-[11px] text-white/80">
        <Icon size={12} />
        <span className="truncate">{name}</span>
        <span className="ml-auto font-mono text-white/45">
          {width} × {height}
        </span>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden bg-white">
        <iframe
          title={`${name} preview`}
          src={url}
          key={`${name}-${url}`}
          className="origin-top-left border-0"
          style={{
            width,
            height,
            transform: `scale(${zoom})`,
            pointerEvents: 'auto',
          }}
        />
      </div>
    </Rnd>
  )
}
