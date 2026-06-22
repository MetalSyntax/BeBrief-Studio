# BeBrief Studio

**v2.0.0** — A premium, modular case study editor for Behance. Build, style and export stunning project briefs with a live canvas, dedicated section editors, multi-project dashboard, JSON portability, and native macOS distribution via Tauri.

---

## Key Features

* **Live Canvas Editing** — Click any text directly on the canvas to edit in place. Edits are instant with no modal dialogs.
* **10 Section Types** — Cover, Overview, Problem, Process, Color Palette, Typography, Mockups, UX Flow, Results, Footer. Each has a dedicated inspector with full content and style controls.
* **Multi-Project Dashboard** — Create, duplicate, delete and switch between projects. Export any project as a `.bbs.json` portable file; import it on any device.
* **JSON Portability** — Save the entire project state (sections, styles, theme, custom tokens) to a versioned `.bbs.json` file and restore it later.
* **Theme System** — 8 built-in themes plus a fully interactive custom theme creator with live color pickers and typography selectors. All themes powered by CSS custom properties.
* **Per-Section Font Override** — Override the display font on any individual section independently of the global theme.
* **Auto-Zoom Canvas** — The canvas scales to fit any viewport width automatically. Works on both desktop and mobile.
* **High-Resolution Exports** — Standalone HTML (self-contained with inlined CSS), PNG and WebP images at `1600px` Behance width.
* **Keyboard Shortcuts** — `Cmd/Ctrl+Z` undo, `Cmd/Ctrl+Shift+Z` redo, `Escape` to deselect.
* **Undo / Redo** — 30-step history for every section and style mutation.
* **Duplicate Section** — One-click section duplication in the sidebar.
* **Toast Notifications** — Non-blocking success/error/info feedback for all actions.
* **OCR Image Import** — Tesseract.js v7 OCR to extract text from uploaded images and map it to section fields.
* **Progressive Web App** — Installable PWA with offline support and Google Fonts cached via Workbox.
* **Native macOS App** — Tauri v2 desktop wrapper with native file save dialogs and binary image write support.
* **i18n** — Full UI localization in English, Spanish and Portuguese.
* **Mobile Tab Bar** — Three-tab bottom navigation (Sections / Canvas / Inspector) on narrow viewports.

---

## Technology Stack

* **Core**: React 19, TypeScript, Vite 8
* **Styling**: Tailwind CSS v4, Lucide React
* **State**: Zustand (single store, undo/redo stacks)
* **DnD**: `@dnd-kit/sortable`
* **Export**: `html-to-image`, custom HTML serializer
* **OCR**: Tesseract.js v7
* **Desktop**: Tauri v2 (`@tauri-apps/cli`, `plugin-fs`, `plugin-dialog`)
* **PWA**: `vite-plugin-pwa` + Workbox
* **i18n**: `react-i18next`

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn

### Installation

1. Clone or copy this repository to your workspace.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the local development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

---

## Getting Started

```bash
npm install
npm run dev          # dev server with HMR
npm run build        # type-check + production build
npm run tauri build  # native macOS .app / .dmg
```

See [CHANGELOG.md](CHANGELOG.md) for full version history.
