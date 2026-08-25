import { createWriteStream } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { deflateSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'

const sizes = [16, 32, 48, 128]
const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons')

await mkdir(outDir, { recursive: true })

for (const size of sizes) {
  const png = encodePng(drawIcon(size))
  await writeFile(path.join(outDir, `icon${size}.png`), png)
}

function drawIcon(size) {
  const data = Buffer.alloc(size * size * 4)
  const bg = [24, 24, 27, 255]
  const frame = [161, 161, 170, 255]
  const screen = [39, 39, 42, 255]
  const accent = [14, 99, 156, 255]
  fill(data, size, 0, 0, size, size, bg)

  const inset = Math.max(2, Math.round(size * 0.14))
  const radius = Math.max(2, Math.round(size * 0.12))
  roundedRect(data, size, inset, inset, size - inset * 2, size - inset * 2, radius, frame)

  const inner = inset + Math.max(1, Math.round(size * 0.08))
  roundedRect(
    data,
    size,
    inner,
    inner,
    size - inner * 2,
    size - inner * 2,
    Math.max(1, radius - 1),
    screen,
  )

  const barH = Math.max(1, Math.round(size * 0.08))
  fill(data, size, inner, inner, size - inner * 2, barH, accent)
  return { width: size, height: size, data }
}

function fill(data, size, x, y, w, h, color) {
  for (let py = y; py < y + h; py++) {
    for (let px = x; px < x + w; px++) {
      setPixel(data, size, px, py, color)
    }
  }
}

function roundedRect(data, size, x, y, w, h, r, color) {
  for (let py = y; py < y + h; py++) {
    for (let px = x; px < x + w; px++) {
      if (insideRounded(px, py, x, y, w, h, r)) setPixel(data, size, px, py, color)
    }
  }
}

function insideRounded(px, py, x, y, w, h, r) {
  const cx = Math.min(Math.max(px, x + r), x + w - r - 1)
  const cy = Math.min(Math.max(py, y + r), y + h - r - 1)
  if (px >= x + r && px < x + w - r) return py >= y && py < y + h
  if (py >= y + r && py < y + h - r) return px >= x && px < x + w
  const dx = px - cx
  const dy = py - cy
  return dx * dx + dy * dy <= r * r
}

function setPixel(data, size, x, y, color) {
  if (x < 0 || y < 0 || x >= size || y >= size) return
  const i = (y * size + x) * 4
  data[i] = color[0]
  data[i + 1] = color[1]
  data[i + 2] = color[2]
  data[i + 3] = color[3]
}

function encodePng({ width, height, data }) {
  const raw = Buffer.alloc((width * 4 + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0
    data.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4)
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  const chunks = [
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]
  return Buffer.concat(chunks)
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type)
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length, 0)
  const crcSource = Buffer.concat([typeBuf, data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(crcSource), 0)
  return Buffer.concat([length, typeBuf, data, crc])
}

function crc32(buf) {
  let crc = 0xffffffff
  for (const byte of buf) {
    crc ^= byte
    for (let i = 0; i < 8; i++) {
      const mask = -(crc & 1)
      crc = (crc >>> 1) ^ (0xedb88320 & mask)
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function writeFile(file, data) {
  return new Promise((resolve, reject) => {
    const stream = createWriteStream(file)
    stream.on('finish', resolve)
    stream.on('error', reject)
    stream.end(data)
  })
}
