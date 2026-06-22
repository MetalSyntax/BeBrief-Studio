import type { ThemeTokens, ThemeId } from '../types/project.types'

export const darkEditorial: ThemeTokens = {
  '--bg': '#0E0B09',
  '--bg-section': '#1a1410',
  '--bg-card': '#241a14',
  '--text': '#F8F4E9',
  '--text-muted': '#C2B4A4',
  '--accent': '#C9A988',
  '--accent-warm': '#D97757',
  '--border': 'rgba(201,169,136,0.15)',
  '--font-display': "'Montserrat', sans-serif",
  '--font-body': "'Montserrat', sans-serif",
  '--radius': '12px',
  '--section-w': '1600px',
}

export const cleanLight: ThemeTokens = {
  '--bg': '#ffffff',
  '--bg-section': '#fafafa',
  '--bg-card': '#f1f1f1',
  '--text': '#333333',
  '--text-muted': '#777777',
  '--accent': '#E03A3A',
  '--accent-2': '#26C2C2',
  '--border': '#eeeeee',
  '--font-display': "'Sora', sans-serif",
  '--font-body': "'Manrope', sans-serif",
  '--radius': '16px',
  '--section-w': '1120px',
}

export const minimal: ThemeTokens = {
  '--bg': '#121214',
  '--bg-section': '#18181b',
  '--bg-card': '#27272a',
  '--text': '#f4f4f5',
  '--text-muted': '#a1a1aa',
  '--accent': '#3b82f6',
  '--border': 'rgba(255,255,255,0.06)',
  '--font-display': "'Inter', sans-serif",
  '--font-body': "'Inter', sans-serif",
  '--radius': '8px',
  '--section-w': '1200px',
}

export const neonNoir: ThemeTokens = {
  '--bg': '#050508',
  '--bg-section': '#0a0a0f',
  '--bg-card': '#111118',
  '--text': '#e8ffe8',
  '--text-muted': '#6aff6a80',
  '--accent': '#00ff88',
  '--accent-2': '#00d4ff',
  '--border': 'rgba(0,255,136,0.12)',
  '--font-display': "'Space Grotesk', sans-serif",
  '--font-body':    "'DM Sans', sans-serif",
  '--radius': '4px',
  '--section-w': '1600px',
}

export const warmParchment: ThemeTokens = {
  '--bg': '#f5f0e8',
  '--bg-section': '#ede8df',
  '--bg-card': '#e8e1d4',
  '--text': '#2c2418',
  '--text-muted': '#7a6a55',
  '--accent': '#b8860b',
  '--accent-warm': '#c9710e',
  '--border': 'rgba(184,134,11,0.2)',
  '--font-display': "'Playfair Display', serif",
  '--font-body':    "'Manrope', sans-serif",
  '--radius': '6px',
  '--section-w': '1600px',
}

export const oceanTech: ThemeTokens = {
  '--bg': '#050d1a',
  '--bg-section': '#071428',
  '--bg-card': '#0a1f3e',
  '--text': '#e8f4ff',
  '--text-muted': '#7ba8cc',
  '--accent': '#00b4d8',
  '--accent-warm': '#ff6b6b',
  '--border': 'rgba(0,180,216,0.15)',
  '--font-display': "'Sora', sans-serif",
  '--font-body':    "'Inter', sans-serif",
  '--radius': '10px',
  '--section-w': '1600px',
}

export const roseEditorial: ThemeTokens = {
  '--bg': '#0f0a0c',
  '--bg-section': '#180f12',
  '--bg-card': '#231318',
  '--text': '#fdf0f3',
  '--text-muted': '#c9909a',
  '--accent': '#e8738a',
  '--accent-warm': '#d4a853',
  '--border': 'rgba(232,115,138,0.15)',
  '--font-display': "'Playfair Display', serif",
  '--font-body':    "'DM Sans', sans-serif",
  '--radius': '14px',
  '--section-w': '1600px',
}

export const forestSage: ThemeTokens = {
  '--bg': '#080f08',
  '--bg-section': '#0d1a0d',
  '--bg-card': '#122312',
  '--text': '#e8f5e8',
  '--text-muted': '#8ab48a',
  '--accent': '#7bc67b',
  '--accent-2': '#c4e854',
  '--border': 'rgba(123,198,123,0.12)',
  '--font-display': "'Manrope', sans-serif",
  '--font-body':    "'Inter', sans-serif",
  '--radius': '16px',
  '--section-w': '1600px',
}

export const defaultCustomTheme: ThemeTokens = {
  '--bg': '#0f0f12',
  '--bg-section': '#16161f',
  '--bg-card': '#20202e',
  '--text': '#ffffff',
  '--text-muted': '#a1a1aa',
  '--accent': '#8b5cf6',
  '--border': 'rgba(255,255,255,0.08)',
  '--font-display': "'Inter', sans-serif",
  '--font-body': "'Inter', sans-serif",
  '--radius': '12px',
  '--section-w': '1600px',
}

export const themes: Record<Exclude<ThemeId, 'custom'>, ThemeTokens> = {
  'dark-editorial': darkEditorial,
  'clean-light': cleanLight,
  'minimal': minimal,
  'neon-noir': neonNoir,
  'warm-parchment': warmParchment,
  'ocean-tech': oceanTech,
  'rose-editorial': roseEditorial,
  'forest-sage': forestSage,
}

// Single source of truth for the theme list — imported by Toolbar and SectionInspector
export const THEME_OPTIONS = [
  { value: 'dark-editorial', label: 'Dark Editorial', group: 'dark' },
  { value: 'minimal',        label: 'Minimal',        group: 'dark' },
  { value: 'neon-noir',      label: 'Neon Noir',      group: 'dark' },
  { value: 'ocean-tech',     label: 'Ocean Tech',     group: 'dark' },
  { value: 'rose-editorial', label: 'Rose Editorial', group: 'dark' },
  { value: 'forest-sage',    label: 'Forest Sage',    group: 'dark' },
  { value: 'clean-light',    label: 'Clean Light',    group: 'light' },
  { value: 'warm-parchment', label: 'Warm Parchment', group: 'light' },
  { value: 'custom',         label: '🎨 Tema Personalizado', group: 'advanced' },
] as const

export function applyTheme(themeId: ThemeId, customTheme?: ThemeTokens) {
  const theme = themeId === 'custom' 
    ? (customTheme || defaultCustomTheme) 
    : themes[themeId as Exclude<ThemeId, 'custom'>]
  if (!theme) return
  
  const root = document.documentElement
  Object.entries(theme).forEach(([key, value]) => {
    if (value) {
      root.style.setProperty(key, value)
    }
  })
}
