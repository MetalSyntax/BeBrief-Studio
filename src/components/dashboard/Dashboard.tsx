import { useRef, useState } from 'react'
import { useProjectStore } from '../../lib/store/projectStore'
import { downloadProjectJSON, parseProjectFromJSON } from '../../lib/export/jsonPortability'
import { useToast } from '../shared/ToastProvider'
import { LegalModal } from '../shared/LegalModal'
import { OnboardingModal, ONBOARDING_STORAGE_KEY } from '../shared/OnboardingModal'
import { Plus, Copy, Trash2, ArrowRight, Sparkles, LayoutGrid, Calendar, Download, Upload, Users, Eye, HelpCircle, Wand2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { communityTemplates } from '../../lib/templates/communityTemplates'
import type { CommunityTemplate } from '../../lib/templates/communityTemplates'
import { compressAndEncodeProject } from '../../lib/utils/shareHelper'
import type { Project } from '../../lib/types/project.types'
import { SECTION_MANIFEST } from '../../lib/sections/manifest'
import { THEME_OPTIONS, themes } from '../../lib/themes'

export function Dashboard() {
  const { t, i18n } = useTranslation()
  const { projects, createNewProject, deleteProject, duplicateProject, selectProject, importProject } = useProjectStore()
  const toast = useToast()
  const importInputRef = useRef<HTMLInputElement>(null)
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms' | null>(null)
  const [activeTab, setActiveTab] = useState<'my-projects' | 'community'>('my-projects')
  const [showOnboarding, setShowOnboarding] = useState(
    () => typeof window !== 'undefined' && !localStorage.getItem(ONBOARDING_STORAGE_KEY)
  )

  // Load community templates including mock published ones
  const publishedIdsString = localStorage.getItem('bbb_community_published')
  const publishedIds = publishedIdsString ? JSON.parse(publishedIdsString) : []
  const userPublishedTemplates: CommunityTemplate[] = publishedIds.map((id: string) => {
    const projStr = localStorage.getItem(`bbb_community_project_${id}`)
    if (!projStr) return null
    const projectData = JSON.parse(projStr)
    return {
      id: `published-${id}`,
      title: projectData.title,
      creator: 'Tú (Creador)',
      description: 'Estudio de caso publicado por ti en tu Galería de la Comunidad local.',
      themeColor: 'bg-[#13131a] border-violet-500/30 text-violet-400',
      badge: 'Publicado',
      project: projectData
    }
  }).filter(Boolean) as CommunityTemplate[]

  const allCommunityTemplates = [...communityTemplates, ...userPublishedTemplates]

  const handleDuplicateTemplate = (tpl: CommunityTemplate) => {
    const newId = `project-${Date.now()}`
    const duplicated: Project = {
      ...JSON.parse(JSON.stringify(tpl.project)),
      id: newId,
      title: `${tpl.project.title} (Copia)`,
      updatedAt: new Date().toISOString()
    }
    importProject(duplicated)
    toast.success(`¡Plantilla "${tpl.title}" duplicada con éxito!`)
  }

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) {
      toast.error(t('dashboard.alertMinProjects', { defaultValue: 'Debes conservar al menos un proyecto en el dashboard.' }))
      return
    }
    deleteProject(id)
  }

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const project = parseProjectFromJSON(text, (warning) => toast.info(warning))
      if (!project) {
        toast.error('Archivo inválido. Asegúrate de importar un .bbs.json generado por BeBrief Studio.')
        return
      }
      importProject(project)
      toast.success(`Proyecto "${project.title}" importado correctamente.`)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const [showAllTemplates, setShowAllTemplates] = useState(false)

  const templates = [
    {
      type: 'default' as const,
      name: t('dashboard.darkEditorial.name', { defaultValue: 'Dark Editorial' }),
      desc: t('dashboard.darkEditorial.desc', { defaultValue: 'Inspirado en App E-Commerce. Alta gama y fondo oscuro cálido.' }),
      themeColor: 'bg-[#1a1410] border-[#C9A988]/30',
      badge: t('dashboard.badgeFeatured', { defaultValue: 'Destacado' })
    },
    {
      type: 'editorial' as const,
      name: t('dashboard.cleanLight.name', { defaultValue: 'Clean Light' }),
      desc: t('dashboard.cleanLight.desc', { defaultValue: 'Inspirado en Business Market Finders. Fondo blanco, limpio y moderno.' }),
      themeColor: 'bg-[#f8f9fa] border-red-500/30 text-zinc-800',
      badge: t('dashboard.badgeClean', { defaultValue: 'Limpio' })
    },
    {
      type: 'minimal' as const,
      name: t('dashboard.minimalDark.name', { defaultValue: 'Minimal Dark' }),
      desc: t('dashboard.minimalDark.desc', { defaultValue: 'Diseño neutro oscuro, ideal para proyectos tecnológicos o de producto.' }),
      themeColor: 'bg-[#18181b] border-blue-500/30',
      badge: t('dashboard.badgeTech', { defaultValue: 'Tech' })
    },
    {
      type: 'brutalist' as const,
      name: 'Retro Brutalist',
      desc: 'Marcos negros marcados, contrastes en amarillo y estética punk editorial.',
      themeColor: 'bg-[#ffff00] border-black/30 text-black',
      badge: 'Brutalista'
    },
    {
      type: 'cyberpunk' as const,
      name: 'Cyberpunk Tech',
      desc: 'Neon y cibergráficos contrastados sobre fondo oscuro puro futurista.',
      themeColor: 'bg-[#030303] border-cyan-400/35 text-cyan-400',
      badge: 'Futuro'
    },
    {
      type: 'nordic' as const,
      name: 'Nordic Studio',
      desc: 'Diseño limpio y frío inspirado en minimalismo y tipografías escandinavas.',
      themeColor: 'bg-[#eef2f6] border-slate-300 text-slate-800',
      badge: 'Nórdico'
    }
  ]

  const getThemeAccent = (proj: Project) => {
    if (proj.theme === 'custom') return proj.customTheme?.['--accent'] || '#8b5cf6'
    return themes[proj.theme as Exclude<typeof proj.theme, 'custom'>]?.['--accent'] || '#8b5cf6'
  }

  const themeCount = THEME_OPTIONS.filter((opt) => opt.value !== 'custom').length

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString)
      return date.toLocaleDateString(i18n.language || 'es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return isoString
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0e11] text-zinc-100 flex flex-col overflow-y-auto custom-scrollbar">
      {/* Upper header */}
      <header className="h-16 border-b border-white/5 bg-[#13131a] px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <img
            src="/favicon.png"
            alt="Logo"
            className="w-8 h-8 rounded-lg shadow-lg shadow-violet-500/20 object-cover"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase block">BeBrief Studio</span>
              <a 
                href="https://metalsyntax.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[8px] bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-600 hover:text-white px-1.5 py-0.5 rounded font-mono font-bold leading-none block transition-colors"
              >
                BY METALSYNTAX
              </a>
            </div>
            <h1 className="text-sm font-semibold text-white tracking-tight leading-none m-0 p-0">
              {t('dashboard.savedProjects', { defaultValue: 'Proyectos Guardados' })}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOnboarding(true)}
            title={t('onboarding.replay')}
            aria-label={t('onboarding.replay')}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 border border-white/10 hover:border-white/20 rounded-lg text-zinc-400 hover:text-white transition-colors"
          >
            <HelpCircle size={14} />
          </button>
          <button
            onClick={() => importInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 hover:border-white/20 rounded-lg text-zinc-400 hover:text-white text-xs font-medium transition-colors"
          >
            <Upload size={13} />
            {t('dashboard.importJSON', { defaultValue: 'Importar .bbs.json' })}
          </button>
        </div>
        <input
          ref={importInputRef}
          type="file"
          accept=".json,.bbs.json"
          className="hidden"
          onChange={handleImportJSON}
        />
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto w-full px-8 py-12 flex-1 flex flex-col gap-12">
        <div className="relative overflow-hidden -mx-8 px-8 pt-4 pb-2">
          <div className="pointer-events-none absolute -top-24 -left-16 w-72 h-72 rounded-full bg-violet-600/20 blur-[100px]" />
          <div className="pointer-events-none absolute -top-10 right-0 w-56 h-56 rounded-full bg-fuchsia-500/10 blur-[90px]" />

          <div className="relative">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-4">
              <Wand2 size={11} />
              {t('dashboard.heroEyebrow', { defaultValue: 'Editor de Case Studies para Behance' })}
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3 max-w-2xl" style={{ fontFamily: 'var(--font-display)' }}>
              {t('dashboard.createCatchyPrefix', { defaultValue: 'Crea Case Studies que' })}{' '}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                {t('dashboard.createCatchyHighlight', { defaultValue: 'cautiven' })}
              </span>
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mb-6">
              {t('dashboard.subtitle', { defaultValue: 'Diseña la estructura de tu caso de estudio de Behance de forma modular. Personaliza colores, fuentes y contenidos, y expórtalo a HTML o PDF standalone.' })}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-zinc-400">
                <LayoutGrid size={12} className="text-violet-400" />
                <span className="text-white font-bold">{SECTION_MANIFEST.length}</span> {t('dashboard.statSections', { defaultValue: 'tipos de sección' })}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-zinc-400">
                <Sparkles size={12} className="text-violet-400" />
                <span className="text-white font-bold">{themeCount}</span> {t('dashboard.statThemes', { defaultValue: 'temas' })}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-zinc-400">
                <Calendar size={12} className="text-violet-400" />
                <span className="text-white font-bold">{projects.length}</span> {t('dashboard.statProjects', { defaultValue: 'proyectos guardados' })}
              </div>
            </div>
          </div>
        </div>

        {/* Templates Area */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-violet-400 text-xs font-mono font-bold tracking-wider uppercase">
              <Sparkles size={14} />
              <span>{t('dashboard.createFromTemplate', { defaultValue: 'Crear desde Plantilla' })}</span>
            </div>
            <button
              onClick={() => setShowAllTemplates(!showAllTemplates)}
              className="text-[10px] font-mono font-bold uppercase text-zinc-400 hover:text-white border border-white/5 hover:border-white/15 bg-zinc-900/40 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              {showAllTemplates ? 'Ver menos' : 'Ver más plantillas'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.slice(0, showAllTemplates ? undefined : 3).map((tpl) => (
              <div
                key={tpl.name}
                onClick={() => createNewProject(`${tpl.name} Case Study`, tpl.type)}
                className={`p-5 rounded-2xl border bg-zinc-900/60 border-white/5 hover:border-violet-500/30 transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/5`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase bg-violet-500/10 border border-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full font-bold">
                      {tpl.badge}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus size={14} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{tpl.name}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">{tpl.desc}</p>
                </div>

                <div className={`h-16 w-full rounded-xl border mt-6 ${tpl.themeColor} flex items-center justify-center opacity-70 group-hover:opacity-90 transition-opacity`}>
                  <LayoutGrid size={18} className="opacity-30" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="inline-flex self-start items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/5">
          <button
            onClick={() => setActiveTab('my-projects')}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'my-projects'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Mis Case Studies ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'community'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Galería de la Comunidad ({allCommunityTemplates.length})
          </button>
        </div>

        {/* Dynamic List Render based on Active Tab */}
        {activeTab === 'my-projects' ? (
          <section className="space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono font-bold tracking-wider uppercase">
                <Calendar size={14} />
                <span>Mis Estudios de Caso</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => selectProject(proj.id)}
                  className="group relative bg-[#13131a] border border-white/5 hover:border-violet-500/30 rounded-2xl p-5 flex flex-col justify-between h-44 cursor-pointer hover:shadow-xl transition-all"
                >
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-violet-400 transition-colors pr-12 line-clamp-1">
                      {proj.title}
                    </h3>
                    <span className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono tracking-wider mt-1.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0 border border-white/20"
                        style={{ backgroundColor: getThemeAccent(proj) }}
                      />
                      {t('dashboard.projectMeta', {
                        defaultValue: 'Tema: {{theme}} · {{count}} secciones',
                        theme: proj.theme.replace('-', ' ').toUpperCase(),
                        count: proj.sections.length
                      })}
                    </span>
                  </div>

                  <div className="flex items-end justify-between mt-6">
                    <div className="text-[10px] text-zinc-500 font-mono">
                      <div>{t('dashboard.modified', { defaultValue: 'Modificado:' })}</div>
                      <div className="text-zinc-400">{formatDate(proj.updatedAt)}</div>
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          duplicateProject(proj.id)
                        }}
                        className="p-2 bg-zinc-900 border border-white/10 hover:border-white/20 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title={t('dashboard.duplicateStudy', { defaultValue: 'Duplicar Proyecto' })}
                        aria-label={t('dashboard.duplicateStudy', { defaultValue: 'Duplicar Proyecto' })}
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          downloadProjectJSON(proj)
                        }}
                        className="p-2 bg-zinc-900 border border-white/10 hover:border-white/20 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title={t('dashboard.exportJSON', { defaultValue: 'Exportar JSON' })}
                        aria-label={t('dashboard.exportJSON', { defaultValue: 'Exportar JSON' })}
                      >
                        <Download size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteProject(proj.id)
                        }}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 transition-colors cursor-pointer"
                        title={t('dashboard.deleteStudy', { defaultValue: 'Eliminar Proyecto' })}
                        aria-label={t('dashboard.deleteStudy', { defaultValue: 'Eliminar Proyecto' })}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <ArrowRight 
                    size={16} 
                    className="absolute top-5 right-5 text-zinc-600 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" 
                  />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono font-bold tracking-wider uppercase">
                <Users size={14} />
                <span>Diseños de la Comunidad Local</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCommunityTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="group relative bg-[#13131a] border border-white/5 hover:border-violet-500/30 rounded-2xl p-5 flex flex-col justify-between h-48 hover:shadow-xl transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[9px] font-mono uppercase bg-violet-500/10 border border-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full font-bold">
                        {tpl.badge}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">Por {tpl.creator}</span>
                    </div>
                    
                    <h3 className="font-bold text-white text-base leading-snug">
                      {tpl.title}
                    </h3>
                    <p className="text-zinc-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        // View read-only preview by encoding and going to URL
                        const payload = compressAndEncodeProject(tpl.project)
                        window.open(`${window.location.origin}${window.location.pathname}?share=${payload}`, '_blank')
                      }}
                      className="flex-1 py-2 bg-zinc-900 border border-white/10 hover:border-white/20 rounded-lg text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye size={12} />
                      Previsualizar
                    </button>
                    
                    <button
                      onClick={() => handleDuplicateTemplate(tpl)}
                      className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus size={12} />
                      Duplicar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0b0b0d] shrink-0">
        <div className="max-w-6xl mx-auto w-full px-8 py-10 flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div className="flex items-center gap-3 max-w-xs">
            <img
              src="/favicon.png"
              alt="Logo"
              className="w-9 h-9 rounded-lg shadow-lg shadow-violet-500/10 object-cover shrink-0"
            />
            <div>
              <div className="text-sm font-bold text-white tracking-tight">BeBrief Studio</div>
              <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                {t('dashboard.footerTagline', { defaultValue: 'Editor modular de case studies para Behance — 100% local, sin cuentas ni servidores.' })}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-16 gap-y-6 text-xs">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600">
                {t('dashboard.footerLegalGroup', { defaultValue: 'Legal' })}
              </span>
              <button
                onClick={() => setLegalTab('privacy')}
                className="text-zinc-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                {t('legal.privacyLink')}
              </button>
              <button
                onClick={() => setLegalTab('terms')}
                className="text-zinc-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                {t('legal.termsLink')}
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600">
                {t('dashboard.footerCreatorGroup', { defaultValue: 'Creado por' })}
              </span>
              <a
                href="https://metalsyntax.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 transition-colors"
              >
                metalsyntax
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5">
          <div className="max-w-6xl mx-auto w-full px-8 py-4 text-[11px] text-zinc-600 text-center md:text-left">
            &copy; {new Date().getFullYear()} BeBrief Studio. {t('dashboard.footerCopyright', { defaultValue: 'Edición modular y exportación standalone.' })}
          </div>
        </div>
      </footer>

      {legalTab && <LegalModal initialTab={legalTab} onClose={() => setLegalTab(null)} />}
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
    </div>
  )
}
export default Dashboard
