import { cpSync, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const dist = path.join(root, 'dist')
const index = path.join(dist, 'index.html')

if (!existsSync(index)) {
  throw new Error('dist/index.html is missing. Vercel would publish an empty folder and 404.')
}

const mirrors = [path.join(root, 'website', 'dist')]
for (const dest of mirrors) {
  mkdirSync(dest, { recursive: true })
  cpSync(dist, dest, { recursive: true })
}

console.log(`Site output ready at ${dist}`)
