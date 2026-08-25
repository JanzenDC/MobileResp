const zipHref = '/mobile-resp.zip'

export function SiteHeader({ current }: { current?: 'home' | 'preview' }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-ink/90 px-5 backdrop-blur-md lg:px-10">
      <a href="/" className="text-[15px] font-semibold tracking-tight text-white no-underline">
        MobileResp
      </a>
      <nav className="flex items-center gap-6 text-sm text-white/70">
        <a
          href="/preview"
          className={`hidden no-underline md:inline ${current === 'preview' ? 'text-white' : 'hover:text-white'}`}
        >
          Preview
        </a>
        <a href="/#product" className="hidden no-underline hover:text-white md:inline">
          Product
        </a>
        <a href="/#install" className="hidden no-underline hover:text-white md:inline">
          Install
        </a>
        <a href="/#faq" className="hidden no-underline hover:text-white md:inline">
          FAQ
        </a>
        <a
          href={zipHref}
          download="mobile-resp.zip"
          className="bg-copper px-4 py-2 text-white no-underline hover:bg-copper-press active:scale-[0.98]"
        >
          Download
        </a>
      </nav>
    </header>
  )
}
