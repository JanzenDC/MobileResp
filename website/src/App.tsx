import { ArrowRight, Browser, DeviceMobile, DownloadSimple } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { LivePreview } from './LivePreview'
import featureIframe from './assets/feature-iframe.png'
import heroViewports from './assets/hero-viewports.png'
import installDesk from './assets/install-desk.png'

const zipHref = '/mobile-resp.zip'

export function App() {
  const reduce = useReducedMotion()

  return (
    <div className="bg-ink text-mist font-sans">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-ink/90 px-5 backdrop-blur-md lg:px-10">
        <a href="#" className="text-[15px] font-semibold tracking-tight text-white no-underline">
          MobileResp
        </a>
        <nav className="flex items-center gap-6 text-sm text-white/70">
          <a href="#preview" className="hidden no-underline hover:text-white md:inline">
            Preview
          </a>
          <a href="#product" className="hidden no-underline hover:text-white md:inline">
            Product
          </a>
          <a href="#install" className="hidden no-underline hover:text-white md:inline">
            Install
          </a>
          <a href="#faq" className="hidden no-underline hover:text-white md:inline">
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

      <section className="grid min-h-[100dvh] lg:grid-cols-2">
        <div className="flex flex-col justify-center px-5 py-16 lg:px-10 lg:py-0">
          <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">
            Chrome extension
          </p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="mt-4 max-w-[18ch] text-5xl leading-[1.1] font-semibold tracking-tighter text-white lg:text-6xl"
          >
            Floating screens on the live page.
          </motion.h1>
          <p className="mt-5 max-w-[36ch] text-base leading-relaxed text-white/65">
            Drop iPhone, iPad, and desktop frames onto the site already open. Compare them together.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={zipHref}
              download="mobile-resp.zip"
              className="inline-flex items-center gap-2 bg-copper px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-copper-press active:scale-[0.98]"
            >
              <DownloadSimple size={18} weight="bold" />
              Download
            </a>
            <a
              href="#install"
              className="inline-flex items-center gap-2 border border-white/20 px-5 py-3 text-sm font-semibold text-white no-underline hover:border-white/40"
            >
              How to install
              <ArrowRight size={16} weight="bold" />
            </a>
          </div>
        </div>
        <div className="relative min-h-[42vh] lg:min-h-0">
          <img
            src={heroViewports}
            alt="Monitor with floating phone and tablet viewport frames over a live website"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </section>

      <LivePreview />

      <section id="product" className="border-t border-white/10">
        <img
          src={featureIframe}
          alt="Close view of a phone-width overlay reflowing the same page"
          className="max-h-[520px] w-full object-cover"
        />
      </section>

      <section className="grid gap-px bg-white/10 lg:grid-cols-[1.4fr_1fr]">
        <article className="bg-ink p-8 lg:p-12">
          <h2 className="max-w-[16ch] text-3xl font-semibold tracking-tight text-white lg:text-4xl">
            A 390px frame behaves like 390px.
          </h2>
          <p className="mt-4 max-w-[54ch] text-base leading-relaxed text-white/65">
            Each window loads the current page in an iframe at that width. Media queries and viewport
            units inside the preview actually change.
          </p>
        </article>
        <div className="grid bg-ink">
          <Feature
            icon={<DeviceMobile size={22} weight="regular" />}
            title="Many frames at once"
            body="Open phone, tablet, and desktop windows together. Drag the header. The page underneath stays usable."
          />
          <Feature
            icon={<Browser size={22} weight="regular" />}
            title="Stays on this machine"
            body="No account and no backend. Device, position, and zoom persist in Chrome storage."
          />
        </div>
      </section>

      <section id="install" className="border-t border-white/10">
        <ol className="divide-y divide-white/10">
          <Step n="01" title="Download the zip" body="Save mobile-resp.zip and unzip it to a folder you can find later." />
          <Step
            n="02"
            title="Load unpacked"
            body="Open chrome://extensions, turn on Developer mode, then Load unpacked and pick the folder that contains manifest.json."
          />
          <Step
            n="03"
            title="Add a viewport"
            body="Open any https page, click the toolbar icon, choose a device, and press Add."
          />
        </ol>
        <img
          src={installDesk}
          alt="Laptop, phone, and unpacked files on a dark desk"
          className="max-h-[420px] w-full object-cover"
        />
      </section>

      <section id="faq" className="border-t border-white/10 px-5 py-16 lg:px-10">
        <p className="font-mono text-[11px] tracking-[0.18em] text-copper uppercase">FAQ</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">Before you load it</h2>
        <div className="mt-8 max-w-3xl">
          <Faq
            q="Why a zip instead of the Chrome Web Store?"
            a="This build is unpacked. Chrome will not one-click install a random file. Load unpacked is the supported path."
          />
          <Faq
            q="Is a sized box a real mobile viewport?"
            a="No. A div with a fixed width does not change window.innerWidth. MobileResp uses same-origin iframes so each frame has its own CSS viewport."
          />
          <Faq
            q="Does every site preview?"
            a="Most do. Frame-busting scripts, chrome:// pages, and the Web Store will not. Header stripping applies to subframes only."
          />
        </div>
      </section>

      <section className="bg-copper px-5 py-16 text-white lg:px-10">
        <h2 className="max-w-[14ch] text-4xl font-semibold tracking-tight">Put the screens on the page.</h2>
        <a
          href={zipHref}
          download="mobile-resp.zip"
          className="mt-8 inline-flex items-center gap-2 bg-ink px-5 py-3 text-sm font-semibold text-white no-underline active:scale-[0.98]"
        >
          <DownloadSimple size={18} weight="bold" />
          Download
        </a>
      </section>

      <footer className="flex flex-col gap-4 px-5 py-10 text-sm text-white/50 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <span>MobileResp 0.1.0</span>
        <div className="flex gap-5">
          <a href="#install" className="text-white/50 no-underline hover:text-white">
            Install
          </a>
          <a href={zipHref} download="mobile-resp.zip" className="text-white/50 no-underline hover:text-white">
            Download
          </a>
        </div>
      </footer>
    </div>
  )
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: ReactNode
  title: string
  body: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      className="border-t border-white/10 p-8 lg:p-10"
    >
      <div className="text-copper">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-white/65">{body}</p>
    </motion.article>
  )
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="grid gap-3 px-5 py-8 lg:grid-cols-[7rem_1fr] lg:px-10">
      <span className="font-mono text-sm text-copper">{n}</span>
      <div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-white/65">{body}</p>
      </div>
    </li>
  )
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="border-t border-white/10 py-5">
      <summary className="cursor-pointer list-none font-medium text-white">{q}</summary>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-white/65">{a}</p>
    </details>
  )
}
