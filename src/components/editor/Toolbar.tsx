import { useState } from 'react'
import { useProjectStore } from '../../lib/store/projectStore'
import type { ThemeId } from '../../lib/types/project.types'
import { THEME_OPTIONS } from '../../lib/themes'
import { Undo2, Redo2, Eye, Download, Sparkles, Copy, Printer, Home, Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CustomSelect } from '../ui/CustomSelect'

interface Props {
  onExportHTML: () => void
  onCopyHTML: () => void
  onExportImage: (format: 'png' | 'webp') => void
}

export function Toolbar({ onExportHTML, onCopyHTML, onExportImage }: Props) {
  const { project, past, future, setTheme, undo, redo, setView, updateProjectTitle, previewMode, setPreviewMode } = useProjectStore()
  const { t, i18n } = useTranslation()
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const currentLang = i18n.language ? i18n.language.split('-')[0] : 'es'

  const languageOptions = [
    { value: 'es', label: 'ES' },
    { value: 'en', label: 'EN' },
    { value: 'pt', label: 'PT' },
  ]

  const groupLabels: Record<string, string> = {
    dark:     t('themes.groupDark',     { defaultValue: 'Temas Oscuros' }),
    light:    t('themes.groupLight',    { defaultValue: 'Temas Claros' }),
    advanced: t('themes.groupAdvanced', { defaultValue: 'Avanzado' }),
  }

  const themeGroups = Object.entries(
    THEME_OPTIONS.reduce<Record<string, { value: string; label: string }[]>>((acc, opt) => {
      if (!acc[opt.group]) acc[opt.group] = []
      acc[opt.group].push({ value: opt.value, label: opt.label })
      return acc
    }, {})
  ).map(([group, options]) => ({ label: groupLabels[group] ?? group, options }))

  return (
    <header className="h-16 border-b border-white/5 bg-[#13131a] px-6 flex items-center justify-between z-30 relative shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setView('dashboard')}
          className="p-2 rounded-lg bg-zinc-900 border border-white/5 hover:border-white/10 text-zinc-400 hover:text-white transition-all mr-1 shrink-0"
          title={t('toolbar.backToDashboard')}
          aria-label={t('toolbar.backToDashboard')}
        >
          <Home size={14} />
        </button>
        
        <img
          src="/favicon.png"
          alt="Logo"
          className="w-8 h-8 rounded-lg shadow-lg shadow-violet-500/20 object-cover shrink-0"
        />
        
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase block">{t('toolbar.appName')}</span>
          <input
            type="text"
            value={project.title}
            onChange={(e) => updateProjectTitle(e.target.value)}
            className="text-sm font-semibold text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-violet-500 focus:outline-none py-0.5 px-0 min-w-[120px] sm:min-w-[200px]"
            title="Editar nombre del brief"
          />
        </div>
      </div>

      {/* Desktop Toolbar */}
      <div className="hidden md:flex items-center gap-4 lg:gap-6">
        {/* Language selector */}
        <CustomSelect
          value={currentLang}
          onChange={(val) => i18n.changeLanguage(val)}
          options={languageOptions}
          icon={<span>🌐</span>}
        />

        {/* Themes selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium hidden sm:inline">{t('toolbar.theme')}:</span>
          <CustomSelect
            value={project.theme}
            onChange={(val) => setTheme(val as ThemeId)}
            groups={themeGroups}
            icon={<Sparkles size={14} className="text-violet-400" />}
          />
        </div>

        <div className="h-4 w-px bg-white/10" />

        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={past.length === 0}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            title="Deshacer (Cmd+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={redo}
            disabled={future.length === 0}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            title="Rehacer (Cmd+Shift+Z)"
          >
            <Redo2 size={16} />
          </button>
        </div>

        <div className="h-4 w-px bg-white/10" />

        {/* Mode switcher & Export */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              previewMode
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                : 'bg-zinc-900 text-zinc-300 border border-white/5 hover:border-white/10 hover:text-white'
            }`}
          >
            <Eye size={14} />
            <span>{previewMode ? t('toolbar.edit') : t('toolbar.preview')}</span>
          </button>

          {previewMode && (
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all"
            >
              <Printer size={14} />
              <span>{t('toolbar.printPdf')}</span>
            </button>
          )}

          <button
            onClick={onCopyHTML}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-200 border border-white/10 hover:text-white transition-all shrink-0"
          >
            <Copy size={14} />
            <span className="hidden sm:inline">{t('toolbar.copyHtml')}</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-all shrink-0"
            >
              <Download size={14} />
              <span>Exportar...</span>
            </button>

            {showExportMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-[#13131a] border border-white/10 rounded-xl shadow-2xl z-50 p-1.5 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      onExportHTML()
                      setShowExportMenu(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 text-zinc-200 hover:text-white transition-colors"
                  >
                    📥 Descargar HTML
                  </button>
                  <button
                    onClick={() => {
                      onExportImage('png')
                      setShowExportMenu(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 text-zinc-200 hover:text-white transition-colors"
                  >
                    🖼️ Exportar PNG (Imagen)
                  </button>
                  <button
                    onClick={() => {
                      onExportImage('webp')
                      setShowExportMenu(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 text-zinc-200 hover:text-white transition-colors"
                  >
                    ⚡ Exportar WEBP (Imagen)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-all shrink-0 focus:outline-none"
        aria-label="Toggle Menu"
      >
        {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-16 left-0 right-0 bg-[#13131a]/95 backdrop-blur-md border-b border-white/10 p-5 z-40 flex flex-col gap-4 md:hidden shadow-2xl">
            {/* Theme & Language row */}
            <div className="flex items-center gap-3">
              {/* Language selector */}
              <CustomSelect
                value={currentLang}
                onChange={(val) => i18n.changeLanguage(val)}
                options={languageOptions}
                icon={<span>🌐</span>}
                className="flex-1"
                triggerClassName="w-full justify-center"
              />

              {/* Themes selector */}
              <CustomSelect
                value={project.theme}
                onChange={(val) => setTheme(val as ThemeId)}
                groups={themeGroups}
                icon={<Sparkles size={14} className="text-violet-400 shrink-0" />}
                className="flex-1"
                triggerClassName="w-full justify-center"
              />
            </div>

            <div className="h-px bg-white/10 w-full" />

            {/* Undo / Redo & Preview */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1 bg-zinc-900 border border-white/10 rounded-lg p-1">
                <button
                  onClick={() => {
                    undo()
                  }}
                  disabled={past.length === 0}
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                  title="Deshacer (Cmd+Z)"
                >
                  <Undo2 size={16} />
                </button>
                <button
                  onClick={() => {
                    redo()
                  }}
                  disabled={future.length === 0}
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                  title="Rehacer (Cmd+Shift+Z)"
                >
                  <Redo2 size={16} />
                </button>
              </div>

              <button
                onClick={() => {
                  setPreviewMode(!previewMode)
                  setIsMobileMenuOpen(false)
                }}
                className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex-1 ${
                  previewMode
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                    : 'bg-zinc-900 text-zinc-300 border border-white/5 hover:border-white/10 hover:text-white'
                }`}
              >
                <Eye size={14} />
                <span>{previewMode ? t('toolbar.edit') : t('toolbar.preview')}</span>
              </button>
            </div>

            <div className="h-px bg-white/10 w-full" />

            {/* Extra Actions */}
            <div className="flex flex-col gap-2">
              {previewMode && (
                <button
                  onClick={() => {
                    window.print()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all"
                >
                  <Printer size={14} />
                  <span>{t('toolbar.printPdf')}</span>
                </button>
              )}

              <button
                onClick={() => {
                  onCopyHTML()
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-200 border border-white/10 hover:text-white transition-all"
              >
                <Copy size={14} />
                <span>{t('toolbar.copyHtml')}</span>
              </button>

              <div className="grid grid-cols-3 gap-2 mt-1">
                <button
                  onClick={() => {
                    onExportHTML()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-semibold bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/20 transition-all"
                >
                  📥 HTML
                </button>
                <button
                  onClick={() => {
                    onExportImage('png')
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-semibold bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/20 transition-all"
                >
                  🖼️ PNG
                </button>
                <button
                  onClick={() => {
                    onExportImage('webp')
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-semibold bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/20 transition-all"
                >
                  ⚡ WEBP
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
export default Toolbar
