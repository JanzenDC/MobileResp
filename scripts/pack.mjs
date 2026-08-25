import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const dist = path.join(root, 'dist')
const out = path.join(root, 'mobile-resp.zip')

if (!existsSync(path.join(dist, 'manifest.json'))) {
  throw new Error('dist/manifest.json is missing. Run pnpm build first.')
}

rmSync(out, { force: true })

if (process.platform === 'win32') {
  execFileSync(
    'powershell.exe',
    [
      '-NoProfile',
      '-Command',
      `Compress-Archive -Path '${dist}\\*' -DestinationPath '${out}' -Force`,
    ],
    { stdio: 'inherit' },
  )
} else {
  mkdirSync(root, { recursive: true })
  execFileSync('zip', ['-r', out, '.'], { cwd: dist, stdio: 'inherit' })
}

console.log(`Packed ${out}`)
