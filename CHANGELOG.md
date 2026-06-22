# Changelog

All notable changes to BeBrief Studio are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). Versioning follows [Semantic Versioning](https://semver.org/).

---

## [2.0.0] - 2026-06-22

### Added
- **JSON Portability** — Export any project to a versioned `.bbs.json` file (`exportProjectToJSON`, `downloadProjectJSON`) and import it back on any device (`parseProjectFromJSON`). Schema version `bbs-v1` with validation.
- **Dashboard Import / Export buttons** — Global "Importar .bbs.json" button in the dashboard header with hidden file input. Per-project "Export JSON" button revealed on card hover (Download icon).
- **`importProject` store action** — Adds the imported project to the projects array, remints the ID on collision, saves to LocalStorage and navigates to the editor.
- **Dedicated inspector editors for all 10 section types** — Problem, Process, Typography, Results and UX Flow now have full content editors in `SectionInspector` instead of the generic fallback.
- **Process step icon picker** — 42-icon grid (5 columns, scrollable) using `CustomSelect` for each step's icon field in the Process inspector.
- **Typography font family picker** — Restricted to the 8 permitted Google Fonts (Montserrat, Sora, Manrope, Space Grotesk, DM Sans, Inter, Bebas Neue, Playfair Display).
- **Per-section display font override** — `displayFont` field in `SectionStyle`; wired in the inspector's CustomSelect and applied as a CSS variable `--font-display` inline override both in `SectionRenderer` and in the HTML exporter.
- **Duplicate section** — Copy icon button in the sidebar row; `duplicateSection(sectionId)` store action deep-clones the section, inserts it after the original and sets it as active.
- **Toast notification system** — `ToastProvider` context with `useToast()` hook returning `{ success, error, info }`. Auto-dismiss at 4 s, fixed bottom-right stack. All `alert()` calls replaced.
- **Keyboard shortcuts** — `useKeyboardShortcuts` hook: `Cmd/Ctrl+Z` undo, `Cmd/Ctrl+Shift+Z` redo, `Escape` deselects the active section.
- **`THEME_OPTIONS` single source of truth** — Exported from `src/lib/themes/index.ts`; Toolbar and SectionInspector both build their theme dropdowns from it instead of duplicating the list.
- **Mobile tab bar i18n** — Labels for Sections / Canvas / Inspector tabs go through `react-i18next`.
- **PWA Google Fonts caching** — Two Workbox runtime cache rules added to `vite.config.ts`: `StaleWhileRevalidate` for `fonts.googleapis.com` stylesheets, `CacheFirst` for `fonts.gstatic.com` font files (1-year TTL, 30 entries).
- **`<html lang>` dynamic attribute in exporter** — `exportProjectToHTML(project, lang)` now writes the detected locale into `<html lang="...">` instead of the hardcoded `"es"`.

### Fixed
- **Image export null element** — `getElementById('brief-render-canvas')` silently returned `null`. Corrected to `'brief-canvas-export'` (actual element ID in `EditorCanvas`).
- **Tauri binary image corruption** — `writeTextFile` re-encoded raw bytes as text, corrupting PNG/WebP. Fixed by using `writeFile(filePath, bytes)` with the raw `Uint8Array`.
- **Broken template literal in HTML exporter** — A stray backtick after `<html lang="${lang}">` closed the template string prematurely, causing ~300 TypeScript parse errors across the entire file.
- **EditableText double-trigger** — Normalized newlines (`\r\n` → `\n`) and trimmed trailing whitespace in `handleBlur` and the sync `useEffect` before comparing values, preventing spurious `onChange` calls.
- **Auto-zoom desktop overflow** — Desktop mode previously set `width: '100%'` and `transform: none`, allowing 1600px sections to overflow narrower viewports. Now always applies `Math.min(1, parentWidth / 1600)` scale-to-fit.
- **OCR worker init (Tesseract.js v7)** — Removed deprecated `loadLanguage` / `initialize` shims; switched to the v7 `createWorker('spa+eng+por', 1, { logger })` three-argument API.
- **`deleteProject` alert in store** — Store cannot access the toast context. Moved the guard (projects ≤ 1) to `Dashboard.handleDeleteProject` which shows a toast; the store action returns early silently.
- **Hardcoded colors in HTML exporter** — Five instances of `color: #fff` replaced with `color: var(--text)` (metric-value, step-title, font-name, color-name, footer-author) so light themes render correctly.
- **`object-contain` typo** — `object-contain: contain` corrected to `object-fit: contain` in the mockups exporter CSS.
- **Portuguese i18n typo** — `"Tamanhoo"` → `"Tamanho"` in `pt.json` `inspector.field.titleSize`.
- **React import missing in `SectionRenderer`** — Added `import React from 'react'` after using `React.CSSProperties` and `React.ReactNode`.

### Changed
- **`package.json` version** — Bumped from `0.0.0` to `2.0.0`.
- **`EditorCanvas` auto-zoom** — Simplified wrapper div to always use scaled pixel dimensions; removed the conditional `width: 100%` branch.
- **Process section icon picker** — Expanded from 9 to 42 icons in a 5-column scrollable grid (14px icons, `w-52 max-h-48 overflow-y-auto`).
- **Cypress test** — Replaced `cy.url().should('include', '/editor')` with `cy.get('#brief-canvas-export').should('exist')` since the SPA has no router.
- **V2_PLAN.md moved** — Roadmap document relocated from the project root to `.plans/V2_PLAN.md`.

---

## [1.2.0] - 2026-06-22

### Added
- Custom theme designer panel with native color pickers and typography selectors.
- Responsive hamburger menu for mobile/tablet in the Toolbar.
- Always-on `contentEditable` for instant single-click text editing on the canvas.
- Visual icon grid picker for the Process section (Lucide icons).
- `CustomSelect` component replacing all native HTML selects.
- Tauri macOS build pipeline and `local-ci.sh` CI automation script.

---

## [1.1.0] - 2026-06-20

### Added
- Mobile canvas locked at `498px` with dynamic `transform: scale` to fit any smartphone viewport.
- Responsive tablet/desktop fluid flow layout.
- Forced `1600px` layout during image export for high-resolution output.

### Fixed
- Canvas left-edge clipping on scaled viewports.
- Flexbox sidebar push caused by missing `min-w-0` on the center column.
- Inline text editing cursor bugs on active sections.

---

## [1.0.0] - 2026-06-15

### Added
- Core 3-column editor layout: Section list, Editor canvas, Property inspector.
- 10 section types: Cover, Overview, Problem, Process, Color Palette, Typography, Mockups, UX Flow, Results, Footer.
- Standalone HTML exporter.
- Multi-language UI (ES, EN, PT) via `react-i18next`.
