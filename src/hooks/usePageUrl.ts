import { useEffect, useState } from 'react'

export function usePageUrl(): string {
  const [url, setUrl] = useState(() => window.location.href)

  useEffect(() => {
    const sync = () => setUrl(window.location.href)
    const wrap = (method: typeof history.pushState) =>
      function wrapped(this: History, ...args: Parameters<typeof history.pushState>) {
        const result = method.apply(this, args)
        sync()
        return result
      }

    const push = history.pushState
    const replace = history.replaceState
    history.pushState = wrap(push)
    history.replaceState = wrap(replace)
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)

    return () => {
      history.pushState = push
      history.replaceState = replace
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  return url
}
