export type DeviceCategory = 'mobile' | 'tablet' | 'desktop' | 'custom'

export type ViewportOrientation = 'portrait' | 'landscape'

export interface DevicePreset {
  id: string
  name: string
  width: number
  height: number
  dpr: number
  category: DeviceCategory
}

export interface Viewport {
  id: string
  deviceId: string
  name: string
  width: number
  height: number
  dpr: number
  x: number
  y: number
  zoom: number
  orientation: ViewportOrientation
  zIndex: number
}

export interface PersistedState {
  enabled: boolean
  viewports: Viewport[]
  customPresets: DevicePreset[]
}

export const ZOOM_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const

export const HEADER_HEIGHT = 36
export const CUSTOM_DEVICE_ID = 'custom'
export const STORAGE_KEY = 'mobile-resp-state'
export const HOST_ID = 'mobile-resp-root'
