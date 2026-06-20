# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite HMR)
npm run build      # Type-check + production build
npm run lint       # ESLint
npm run preview    # Preview production build locally
npm run test       # Run Jest unit tests
npm run cypress:run # Run Cypress E2E tests
```

## Architecture

Single-page React app with a 3-column editor layout:

- **Left sidebar** — `SectionList.tsx`: drag-and-drop section reordering via `@dnd-kit/sortable`
- **Center canvas** — `EditorCanvas.tsx`: renders all visible sections in order; toggles between edit and preview modes
- **Right panel** — `SectionInspector.tsx`: content and style controls for the active section
- **Top bar** — `Toolbar.tsx`: theme switcher, language switcher, undo/redo, preview toggle, HTML export

### State (`src/lib/store/projectStore.ts`)

Single Zustand store holds the entire `Project` (sections array, theme, metadata) plus undo/redo stacks (capped at 30). Every mutation goes through store actions — never mutate state directly. Undo/redo automatically tracks every action that calls `saveToHistory`.

Key actions: `updateSection(id, dataPatch)`, `updateSectionStyle(id, stylePatch)`, `addSection(type)`, `reorderSections(sections)`, `setTheme(themeId)`.

### Sections (`src/components/sections/`)

One component per section type. Each receives the full `Section` object (including `section.data` and `section.style`) and an `isEditing` boolean. Section types: `cover`, `overview`, `problem`, `process`, `color-palette`, `typography`, `mockups`, `ux-flow`, `results`, `footer`.

`src/components/sections/index.tsx` exports a map from `SectionType` → component, used by `EditorCanvas` to render dynamically.

### Theming

Themes are CSS custom property maps defined in `src/lib/themes/index.ts`. `applyTheme(themeId)` writes them directly to `document.documentElement.style`. All section styles must use `var(--bg)`, `var(--text)`, `var(--accent)`, etc. — never hardcode colors. Available themes: `dark-editorial`, `clean-light`, `minimal`.

### Export (`src/lib/export/htmlExporter.ts`)

`exportProjectToHTML(project)` serializes the store state into a standalone HTML file with all CSS inlined in a `<style>` tag. It uses Google Fonts via `@import` (not truly offline). The exporter has a `switch` over every `SectionType` — when adding a new section, add a case here.

### Internacionalización (i18n)

- All UI editor labels, placeholders, titles, buttons, and loading states must go through `react-i18next` (`useTranslation`).
- Locales are defined in `src/lib/i18n/locales/{es,en,pt}.json`.
- Dynamic keys for new sections (added in `projectStore.ts`) use `i18n.t(...)` to fetch current localized placeholder names.
- User-entered brief content (data) is kept in the user's input language and is not localized.

## Adding a New Section

1. Add the data interface to `src/lib/types/project.types.ts` and add the type to the `SectionType` union
2. Create `src/components/sections/[Name]Section.tsx`
3. Register it in `src/components/sections/index.tsx`
4. Add default data to the `addSection` switch in `projectStore.ts`
5. Add a `case` in `htmlExporter.ts`
6. Add default section data to `src/lib/templates/defaultSections.ts` if it should appear in new projects

## Key Constraints

- Section width is always `1600px` (full-bleed) with content inside a `max-width: 1120px` wrapper — match this in both the React component and the HTML exporter
- The exported HTML links Google Fonts externally; if the brief must be truly self-contained, fonts need to be embedded as base64
- Permitted Google Fonts: Montserrat, Sora, Manrope, Space Grotesk, DM Sans, Inter, Bebas Neue, Playfair Display

## OCR
- `src/lib/ocr/ocrEngine.ts` — Lazy-load de Tesseract.js; no importar en el bundle principal.
- `ImageUploader` component en `src/components/shared/` — Reutilizable en cualquier sección, con soporte opcional de OCR trigger.
- Las imágenes se convierten a base64 antes de pasar al OCR y al store.
- Las heurísticas en `src/lib/ocr/textMapper.ts` ayudan a mapear bloques detectados a campos del formulario según tamaño de fuente y formatos.
