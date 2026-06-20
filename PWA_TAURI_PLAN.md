# PLAN: Migración a PWA y Portabilidad Desktop con Tauri

Este documento describe la hoja de ruta y especificaciones técnicas para transformar la aplicación web **Behance Brief Builder** en una Aplicación Web Progresiva (PWA) instalable y realizar un port de escritorio nativo (macOS, Windows, Linux) utilizando **Tauri**.

---

## PARTE 1: Implementación de Progressive Web App (PWA)

El objetivo es lograr que la aplicación sea instalable en dispositivos móviles y de escritorio, y que funcione de forma 100% offline (incluyendo el motor OCR local).

### 1. Configuración de Vite PWA Plugin
La forma más limpia e integrada en el ecosistema Vite es utilizar `@vite-pwa/plugin`.

```bash
npm install -D vite-plugin-pwa
```

#### Modificación en `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Behance Brief Builder',
        short_name: 'BehanceBrief',
        description: 'Creador modular de briefs de diseño para Behance',
        theme_color: '#0e0e11',
        background_color: '#0e0e11',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Cachear chunks de JS/CSS y archivos de idiomas de Tesseract
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            // Cachear datos de entrenamiento de idiomas para Tesseract OCR de los CDNs
            urlPattern: /^https:\/\/raw\.githubusercontent\.com\/naptha\/tessdata\/master\/3\.02\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tesseract-lang-data',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año de caché
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
})
```

### 2. Registro del Service Worker
Importar el módulo virtual de registro en `src/main.tsx`:

```typescript
import { registerSW } from 'virtual:pwa-register'

if (import.meta.env.PROD) {
  registerSW({ immediate: true })
}
```

---

## PARTE 2: Port de Escritorio con Tauri (v2)

**Tauri** permite empaquetar el front-end compilado (HTML/JS/CSS) usando Rust como capa de sistema operativo nativa, consumiendo el Webview del sistema (menor peso en disco y memoria RAM comparado con Electron).

### 1. Inicialización de Tauri en el Proyecto

#### Instalar dependencias CLI
```bash
npm install -D @tauri-apps/cli@latest @tauri-apps/api@latest
```

#### Inicializar estructura
```bash
npx tauri init
```

* **App Name**: `Behance Brief Builder`
* **Window Title**: `Behance Brief Builder`
* **Web assets directory**: `../dist` (ruta relativa al bundle de producción)
* **Dev Server URL**: `http://localhost:5173` (Vite Dev Server)

Esto creará el subdirectorio `src-tauri/` en la raíz del proyecto.

### 2. Configuración Nativa (`src-tauri/tauri.conf.json`)

Se deben habilitar permisos para el guardado directo de archivos y acceso al portapapeles:

```json
{
  "productName": "Behance Brief Builder",
  "version": "1.0.0",
  "identifier": "com.metalsyntax.behancebriefbuilder",
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devUrl": "http://localhost:5173",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "Behance Brief Builder",
        "width": 1280,
        "height": 800,
        "resizable": true,
        "fullscreen": false
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  }
}
```

### 3. Integración con el Sistema Operativo (Guardado Nivel OS)

Para mejorar la experiencia en Desktop, en lugar de descargar el HTML en descargas del navegador, usaremos diálogos nativos de Tauri para guardar directamente a disco.

#### Modificación en `src/components/editor/Toolbar.tsx`

```typescript
import { save } from '@tauri-apps/plugin-dialog'
import { writeTextFile } from '@tauri-apps/plugin-fs'

// Detectar si está corriendo dentro de Tauri
const isTauri = typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__ !== undefined;

const handleExportHTML = async () => {
  const htmlContent = exportProjectToHTML(project);
  
  if (isTauri) {
    try {
      const filePath = await save({
        filters: [{
          name: 'HTML Document',
          extensions: ['html']
        }],
        defaultPath: `${project.title}.html`
      });
      
      if (filePath) {
        await writeTextFile(filePath, htmlContent);
        alert('Archivo guardado exitosamente.');
      }
    } catch (err) {
      console.error('Error al guardar con Tauri:', err);
    }
  } else {
    // Descarga estándar en navegador
    triggerBrowserDownload(htmlContent);
  }
};
```

---

## Cronograma de Ejecución Propuesto

### Día 1: Configuración de Assets e Iconografía
- Generar assets obligatorios para PWA/Tauri (`pwa-192x192.png`, `pwa-512x512.png`, `.icns` para macOS, `.ico` para Windows).
- Configurar el manifiesto y compilar para validar compatibilidad PWA en Lighthouse.

### Día 2: Integración de Tauri CLI
- Instalar Rust y Cargo.
- Inicializar `tauri init` y configurar ventanas nativas con variables de CSS.
- Validar el comando `npm run tauri dev` en modo hot-reload.

### Día 3: APIs nativas e Integración de Guardado
- Habilitar `@tauri-apps/plugin-dialog` y `@tauri-apps/plugin-fs`.
- Implementar guardado directo de HTML/PDF sobreescribiendo el gestor de descargas en entorno de escritorio.

### Día 4: Empaquetado y Compilación Multiplataforma
- Ejecutar `npm run tauri build` para empaquetar aplicaciones nativas de escritorio.
