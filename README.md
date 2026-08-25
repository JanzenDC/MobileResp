# MobileResp

Chrome extension that overlays independent device viewports on the current page.

Chrome does not allow a random `.crx` to one-click install. The easy local install is a zip.

## Easy install

```bash
corepack pnpm install
corepack pnpm zip
```

That writes `mobile-resp.zip` in the project folder.

1. Unzip `mobile-resp.zip` to a folder (for example `mobile-resp-unpacked`)
2. Open `chrome://extensions`
3. Turn on **Developer mode**
4. **Load unpacked** → select that folder (the one that contains `manifest.json`)

Reload the extension there after each new pack.

## Dev build

```bash
corepack pnpm icons
corepack pnpm build
```

Load unpacked → `dist`.
