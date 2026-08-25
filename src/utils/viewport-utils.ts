import { HEADER_HEIGHT, type Viewport } from '@/types/viewport'

export function cascadePosition(index: number): { x: number; y: number } {
  const offset = 28 + (index % 8) * 28
  return { x: offset, y: offset }
}

export function nextZIndex(viewports: Viewport[]): number {
  return viewports.reduce((max, viewport) => Math.max(max, viewport.zIndex), 1) + 1
}

export function visualFrameSize(width: number, height: number, zoom: number) {
  return {
    width: Math.max(160, Math.round(width * zoom)),
    height: Math.max(80, Math.round(height * zoom)),
  }
}

export function cssSizeFromFrame(
  frameWidth: number,
  frameHeight: number,
  zoom: number,
): { width: number; height: number } {
  return {
    width: Math.max(200, Math.round(frameWidth / zoom)),
    height: Math.max(120, Math.round((frameHeight - HEADER_HEIGHT) / zoom)),
  }
}

export function formatZoom(zoom: number): string {
  return `${Math.round(zoom * 100)}%`
}

export function formatSize(width: number, height: number): string {
  return `${width} × ${height}`
}
