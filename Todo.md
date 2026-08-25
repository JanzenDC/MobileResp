Here’s a ready-to-use prompt you can give to **Claude Code, Cursor, Lovable, Bolt, or another coding AI**:

# Build a Chrome Extension: Floating Responsive Viewport Tester

Create a Chrome/Chromium browser extension that works as a **floating responsive design testing tool**.

The main idea is NOT to replace Chrome DevTools. Instead, create a lightweight overlay system where users can open **multiple floating device viewports on top of the current website**, drag them around, resize them, change devices, and test different screen sizes simultaneously.

## Core Concept

When the extension is activated on a webpage, it should provide a floating control panel.

The user can click:

**+ Add Viewport**

Each viewport appears as a floating window over the current webpage.

Example:

```text
┌──────────────────────────────┐
│ iPhone 15     390 × 844   ↻ × │
├──────────────────────────────┤
│                              │
│                              │
│        WEBSITE PREVIEW       │
│                              │
│                              │
└──────────────────────────────┘

┌──────────────────────────────┐
│ iPad          820 × 1180  ↻ × │
├──────────────────────────────┤
│                              │
│        WEBSITE PREVIEW       │
│                              │
└──────────────────────────────┘
```

Users should be able to have multiple viewports open simultaneously.

---

# Technology

Use:

* React
* TypeScript
* Vite
* Chrome Extension Manifest V3
* Modern CSS
* Chrome Extension APIs where necessary

Keep the architecture clean and modular.

Do NOT use unnecessary frameworks.

---

# Main Features

## 1. Floating Viewports

Create viewport windows that float above the current webpage.

Each viewport should:

* Be draggable
* Be resizable
* Be movable independently
* Have a header/toolbar
* Have a close button
* Have a rotate button
* Display current width and height
* Support multiple instances
* Maintain its own position and dimensions

The viewport should behave similarly to a floating window in a design application.

---

# 2. Multiple Viewports

Users should be able to add unlimited viewports.

Example:

```text
+ Add Viewport

iPhone 15
Galaxy S24
iPad
Desktop 1440
Custom 500 × 900
```

Each viewport should be independent.

Dragging one viewport must not affect another.

---

# 3. Device Selector

Each viewport should have a device selector.

Default presets:

### Mobile

* iPhone SE
* iPhone 13
* iPhone 14
* iPhone 15
* iPhone 15 Pro
* iPhone 15 Pro Max
* Samsung Galaxy S24
* Samsung Galaxy S24 Ultra
* Google Pixel

### Tablet

* iPad
* iPad Air
* iPad Pro 11"
* iPad Pro 12.9"

### Desktop

* 1280 × 720
* 1366 × 768
* 1440 × 900
* 1920 × 1080

Also provide:

**Custom**

where the user can manually enter:

```text
Width
Height
Device Pixel Ratio
```

---

# 4. Change Screen Size

Users should be able to change:

```text
Width: 390
Height: 844
```

The viewport should immediately update.

Show the dimensions in the viewport header.

Example:

```text
iPhone 15 · 390 × 844
```

---

# 5. Rotate Device

Add a rotate button:

```text
↻
```

When clicked:

```text
390 × 844
```

becomes:

```text
844 × 390
```

The viewport should visually rotate between portrait and landscape dimensions.

---

# 6. Drag and Drop

Users must be able to drag the viewport by its header.

Example:

```text
┌─────────────────────────────┐
│ iPhone 15       390×844  ↻ ×│ ← drag here
└─────────────────────────────┘
```

Do not make the entire viewport draggable because that would interfere with interacting with the webpage.

Only the header should be draggable.

---

# 7. Resize

Allow users to resize the viewport manually.

The viewport should have resize handles similar to a desktop window.

At minimum support:

* Bottom-right resize
* Bottom resize
* Right resize

When resized, update:

```text
390 × 844
```

in real time.

---

# 8. Zoom

Each viewport should support zoom.

Options:

```text
50%
75%
100%
125%
150%
200%
```

The zoom should affect the viewport preview without changing the actual dimensions being tested.

---

# 9. Viewport Toolbar

Create a clean toolbar:

```text
┌───────────────────────────────────────┐
│ ☰  iPhone 15 ▼  390×844  🔍  ↻  ×    │
└───────────────────────────────────────┘
```

Functions:

* Device selector
* Dimensions
* Zoom
* Rotate
* Close

Keep the toolbar compact.

---

# 10. Main Extension Panel

Clicking the Chrome extension icon should open a small control panel.

Example:

```text
┌─────────────────────────────┐
│ Responsive Viewer           │
│                             │
│ [+ Add Viewport]            │
│                             │
│ Active Viewports             │
│                             │
│ ● iPhone 15   390 × 844     │
│ ● iPad        820 × 1180    │
│                             │
│ [Clear All]                 │
└─────────────────────────────┘
```

The popup should allow users to:

* Add viewport
* Select default device
* Clear all viewports
* Enable/disable overlay
* Access settings

---

# 11. Viewport Management

Add a small management system.

Users should be able to:

* Add viewport
* Duplicate viewport
* Delete viewport
* Change device
* Rotate
* Resize
* Move
* Zoom

Add a **Duplicate** option because it is useful when testing similar screen sizes.

---

# 12. Persistence

Store viewport configuration using:

```text
chrome.storage.local
```

Persist:

* Device
* Width
* Height
* Position
* Zoom
* Rotation
* Viewport visibility

When the extension is reopened, restore the previous setup.

---

# 13. Preset Management

Allow users to create custom presets.

Example:

```text
Custom Devices

My Phone
375 × 812

Client Mobile
390 × 844

Client Tablet
768 × 1024
```

Provide:

```text
Save as Preset
Delete Preset
```

---

# 14. UI / UX

The UI should look like a professional developer tool.

Design principles:

* Minimal
* Clean
* Compact
* Modern
* Developer-focused
* No unnecessary gradients
* No excessive rounded cards
* No flashy animations
* Avoid an "AI-generated" visual style

Use subtle borders, shadows, spacing, and typography.

The floating viewport should clearly stand out from the website underneath it.

---

# 15. Important Interaction Behavior

The webpage underneath the viewport must remain usable.

Users should be able to:

* Scroll the actual webpage
* Click webpage elements
* Inspect responsive behavior
* Interact with the floating viewport independently

The viewport itself should capture pointer events only within its own area.

Dragging should only happen from the viewport header.

---

# 16. Architecture

Use a clean architecture similar to:

```text
src/
├── background/
│   └── service-worker.ts
│
├── content/
│   ├── content.ts
│   ├── viewport-manager.ts
│   ├── viewport.ts
│   └── styles.css
│
├── popup/
│   ├── Popup.tsx
│   ├── popup.css
│   └── components/
│
├── components/
│   ├── ViewportWindow.tsx
│   ├── ViewportHeader.tsx
│   ├── DeviceSelector.tsx
│   ├── ResizeHandle.tsx
│   ├── ZoomControl.tsx
│   └── DevicePresetMenu.tsx
│
├── data/
│   └── devices.ts
│
├── hooks/
│   ├── useViewport.ts
│   └── useViewportManager.ts
│
├── types/
│   └── viewport.ts
│
└── utils/
    └── viewport-utils.ts
```

---

# 17. Manifest

Use:

```text
Manifest V3
```

Request only the permissions that are actually required.

Avoid unnecessary permissions.

---

# 18. MVP Priority

Build the MVP in this order:

### Phase 1

* Chrome extension setup
* Manifest V3
* React + TypeScript + Vite
* Content script
* Floating viewport
* Dragging
* Closing
* Multiple viewports

### Phase 2

* Device presets
* Device switching
* Custom width/height
* Rotation
* Resize
* Zoom

### Phase 3

* Persistence
* Custom presets
* Duplicate viewport
* Viewport manager
* Improved UI

### Phase 4

* Screenshot
* Full-page screenshot
* Keyboard shortcuts
* Advanced device settings

---

# Critical Requirement

The most important UX requirement is:

**The extension must feel like floating responsive windows layered over the current webpage.**

It should NOT feel like:

* Chrome DevTools
* A separate website
* A normal popup-only responsive tester
* A full-screen device emulator

The user should be able to open:

```text
+ iPhone
+ Galaxy
+ iPad
+ Desktop
```

and freely arrange them over the current webpage.

Think:

**Figma floating frames + browser responsive testing + Chrome extension overlay.**

Build the MVP first, make sure the core interaction works correctly, then add advanced features.

Before writing large amounts of code, establish the extension architecture and explain any Chrome API limitations that affect the floating viewport behavior.
