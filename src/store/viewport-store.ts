import { DEFAULT_DEVICE_ID, getPresetById } from '@/data/devices'
import { STORAGE_KEY, type PersistedState, type Viewport } from '@/types/viewport'
import { cascadePosition, nextZIndex } from '@/utils/viewport-utils'
import { create } from 'zustand'

interface ViewportStore extends PersistedState {
  hydrated: boolean
  hydrate: (state: PersistedState) => void
  addViewport: (deviceId?: string) => void
  removeViewport: (id: string) => void
  duplicateViewport: (id: string) => void
  updateViewport: (
    id: string,
    patch: Partial<Viewport>,
    options?: { persist?: boolean },
  ) => void
  bringToFront: (id: string) => void
  clearAll: () => void
  setEnabled: (enabled: boolean) => void
  addCustomPreset: (name: string, width: number, height: number, dpr: number) => void
  removeCustomPreset: (id: string) => void
}

let persistTimer: ReturnType<typeof setTimeout> | undefined
let applyingRemote = false

function persistNow(state: PersistedState) {
  if (applyingRemote || typeof chrome === 'undefined' || !chrome.storage?.local) return
  void chrome.storage.local.set({
    [STORAGE_KEY]: {
      enabled: state.enabled,
      viewports: state.viewports,
      customPresets: state.customPresets,
    } satisfies PersistedState,
  })
}

function schedulePersist() {
  if (applyingRemote) return
  clearTimeout(persistTimer)
  persistTimer = setTimeout(() => {
    const { enabled, viewports, customPresets } = useViewportStore.getState()
    persistNow({ enabled, viewports, customPresets })
  }, 80)
}

function snapshot(state: ViewportStore): PersistedState {
  return {
    enabled: state.enabled,
    viewports: state.viewports,
    customPresets: state.customPresets,
  }
}

export const useViewportStore = create<ViewportStore>((set, get) => ({
  hydrated: false,
  enabled: false,
  viewports: [],
  customPresets: [],

  hydrate: (state) => {
    applyingRemote = true
    set({
      hydrated: true,
      enabled: state.enabled,
      viewports: state.viewports,
      customPresets: state.customPresets,
    })
    queueMicrotask(() => {
      applyingRemote = false
    })
  },

  addViewport: (deviceId = DEFAULT_DEVICE_ID) => {
    const { viewports, customPresets } = get()
    const preset = getPresetById(deviceId, customPresets) ?? getPresetById(DEFAULT_DEVICE_ID, [])
    if (!preset) return
    const position = cascadePosition(viewports.length)
    const viewport: Viewport = {
      id: crypto.randomUUID(),
      deviceId: preset.id,
      name: preset.name,
      width: preset.width,
      height: preset.height,
      dpr: preset.dpr,
      x: position.x,
      y: position.y,
      zoom: 1,
      orientation: 'portrait',
      zIndex: nextZIndex(viewports),
    }
    set({ enabled: true, viewports: [...viewports, viewport] })
    persistNow(snapshot(get()))
  },

  removeViewport: (id) => {
    set({ viewports: get().viewports.filter((viewport) => viewport.id !== id) })
    persistNow(snapshot(get()))
  },

  duplicateViewport: (id) => {
    const source = get().viewports.find((viewport) => viewport.id === id)
    if (!source) return
    const copy: Viewport = {
      ...source,
      id: crypto.randomUUID(),
      x: source.x + 28,
      y: source.y + 28,
      zIndex: nextZIndex(get().viewports),
    }
    set({ viewports: [...get().viewports, copy] })
    persistNow(snapshot(get()))
  },

  updateViewport: (id, patch, options) => {
    set({
      viewports: get().viewports.map((viewport) =>
        viewport.id === id ? { ...viewport, ...patch } : viewport,
      ),
    })
    if (options?.persist === false) return
    schedulePersist()
  },

  bringToFront: (id) => {
    const zIndex = nextZIndex(get().viewports)
    set({
      viewports: get().viewports.map((viewport) =>
        viewport.id === id ? { ...viewport, zIndex } : viewport,
      ),
    })
    schedulePersist()
  },

  clearAll: () => {
    set({ viewports: [] })
    persistNow(snapshot(get()))
  },

  setEnabled: (enabled) => {
    set({ enabled })
    persistNow(snapshot(get()))
  },

  addCustomPreset: (name, width, height, dpr) => {
    const id = `custom-${crypto.randomUUID()}`
    set({
      customPresets: [
        ...get().customPresets,
        { id, name, width, height, dpr, category: 'custom' },
      ],
    })
    persistNow(snapshot(get()))
  },

  removeCustomPreset: (id) => {
    set({ customPresets: get().customPresets.filter((preset) => preset.id !== id) })
    persistNow(snapshot(get()))
  },
}))

export async function hydrateStore() {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) {
    useViewportStore.setState({ hydrated: true })
    return
  }
  const result = await chrome.storage.local.get(STORAGE_KEY)
  const stored = result[STORAGE_KEY] as PersistedState | undefined
  useViewportStore.getState().hydrate(
    stored ?? { enabled: false, viewports: [], customPresets: [] },
  )
}

export function listenStorageSync() {
  if (typeof chrome === 'undefined' || !chrome.storage?.onChanged) return
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || !changes[STORAGE_KEY]) return
    const next = changes[STORAGE_KEY].newValue as PersistedState | undefined
    if (!next) return
    const current = snapshot(useViewportStore.getState())
    if (JSON.stringify(current) === JSON.stringify(next)) return
    useViewportStore.getState().hydrate(next)
  })
}
