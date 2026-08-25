import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: 'MobileResp',
  description:
    'Floating device viewports over the current page for responsive testing.',
  version: pkg.version,
  action: {
    default_title: 'MobileResp',
    default_popup: 'src/popup/index.html',
    default_icon: {
      16: 'icons/icon16.png',
      32: 'icons/icon32.png',
      48: 'icons/icon48.png',
      128: 'icons/icon128.png',
    },
  },
  icons: {
    16: 'icons/icon16.png',
    32: 'icons/icon32.png',
    48: 'icons/icon48.png',
    128: 'icons/icon128.png',
  },
  background: {
    service_worker: 'src/background/service-worker.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['src/content/content.tsx'],
      run_at: 'document_idle',
      all_frames: false,
    },
  ],
  permissions: ['storage', 'declarativeNetRequest'],
  host_permissions: ['http://*/*', 'https://*/*'],
  declarative_net_request: {
    rule_resources: [
      {
        id: 'iframe_headers',
        enabled: true,
        path: 'src/rules/iframe-headers.json',
      },
    ],
  },
})
