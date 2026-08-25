import { CUSTOM_DEVICE_ID, type DevicePreset } from '@/types/viewport'

export const DEVICE_PRESETS: DevicePreset[] = [
  { id: 'iphone-se', name: 'iPhone SE', width: 375, height: 667, dpr: 2, category: 'mobile' },
  { id: 'iphone-13', name: 'iPhone 13', width: 390, height: 844, dpr: 3, category: 'mobile' },
  { id: 'iphone-14', name: 'iPhone 14', width: 390, height: 844, dpr: 3, category: 'mobile' },
  { id: 'iphone-15', name: 'iPhone 15', width: 393, height: 852, dpr: 3, category: 'mobile' },
  { id: 'iphone-15-pro', name: 'iPhone 15 Pro', width: 393, height: 852, dpr: 3, category: 'mobile' },
  { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max', width: 430, height: 932, dpr: 3, category: 'mobile' },
  { id: 'galaxy-s24', name: 'Galaxy S24', width: 360, height: 780, dpr: 3, category: 'mobile' },
  { id: 'galaxy-s24-ultra', name: 'Galaxy S24 Ultra', width: 384, height: 824, dpr: 3, category: 'mobile' },
  { id: 'pixel-8', name: 'Google Pixel 8', width: 412, height: 915, dpr: 2.625, category: 'mobile' },
  { id: 'ipad', name: 'iPad', width: 768, height: 1024, dpr: 2, category: 'tablet' },
  { id: 'ipad-air', name: 'iPad Air', width: 820, height: 1180, dpr: 2, category: 'tablet' },
  { id: 'ipad-pro-11', name: 'iPad Pro 11"', width: 834, height: 1194, dpr: 2, category: 'tablet' },
  { id: 'ipad-pro-12', name: 'iPad Pro 12.9"', width: 1024, height: 1366, dpr: 2, category: 'tablet' },
  { id: 'desktop-1280', name: 'Desktop 1280', width: 1280, height: 720, dpr: 1, category: 'desktop' },
  { id: 'desktop-1366', name: 'Desktop 1366', width: 1366, height: 768, dpr: 1, category: 'desktop' },
  { id: 'desktop-1440', name: 'Desktop 1440', width: 1440, height: 900, dpr: 1, category: 'desktop' },
  { id: 'desktop-1920', name: 'Desktop 1920', width: 1920, height: 1080, dpr: 1, category: 'desktop' },
]

export const DEFAULT_DEVICE_ID = 'iphone-15'

export function getBuiltinPreset(id: string): DevicePreset | undefined {
  return DEVICE_PRESETS.find((device) => device.id === id)
}

export function getPresetById(
  id: string,
  customPresets: DevicePreset[],
): DevicePreset | undefined {
  if (id === CUSTOM_DEVICE_ID) return undefined
  return getBuiltinPreset(id) ?? customPresets.find((device) => device.id === id)
}

export function groupedPresets(customPresets: DevicePreset[]) {
  return {
    mobile: DEVICE_PRESETS.filter((device) => device.category === 'mobile'),
    tablet: DEVICE_PRESETS.filter((device) => device.category === 'tablet'),
    desktop: DEVICE_PRESETS.filter((device) => device.category === 'desktop'),
    custom: customPresets,
  }
}
