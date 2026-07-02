import { useRef, useState } from 'react'
import { useProjectStore } from '../../lib/store/projectStore'
import { downloadProjectJSON, parseProjectFromJSON } from '../../lib/export/jsonPortability'
import { useToast } from '../shared/ToastProvider'
import { Plus, Copy, Trash2, ArrowRight, Sparkles, LayoutGrid, Calendar, Download, Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function Dashboard() {
  const { t, i18n } = useTranslation()
  const { projects, createNewProject, deleteProject, duplicateProject, selectProject, importProject } = useProjectStore()
  const toast = useToast()
  const importInputRef = useRef<HTMLInputElement>(null)

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
      const project = parseProjectFromJSON(text)
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
        <button
          onClick={() => importInputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 hover:border-white/20 rounded-lg text-zinc-400 hover:text-white text-xs font-medium transition-colors"
        >
          <Upload size={13} />
          {t('dashboard.importJSON', { defaultValue: 'Importar .bbs.json' })}
        </button>
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
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            {t('dashboard.createCatchy', { defaultValue: 'Crea Case Studies que cautiven' })}
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl">
            {t('dashboard.subtitle', { defaultValue: 'Diseña la estructura de tu caso de estudio de Behance de forma modular. Personaliza colores, fuentes y contenidos, y expórtalo a HTML o PDF standalone.' })}
          </p>
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

        {/* Existing Projects List */}
        <section className="space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono font-bold tracking-wider uppercase">
              <Calendar size={14} />
              <span>{t('dashboard.myStudies', { defaultValue: 'Mis Case Studies ({{count}})', count: projects.length })}</span>
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
                  <span className="text-[10px] text-zinc-500 font-mono tracking-wider block mt-1">
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
                      className="p-2 bg-zinc-900 border border-white/10 hover:border-white/20 rounded-lg text-zinc-400 hover:text-white transition-colors"
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
                      className="p-2 bg-zinc-900 border border-white/10 hover:border-white/20 rounded-lg text-zinc-400 hover:text-white transition-colors"
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
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 transition-colors"
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
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-zinc-500 shrink-0 flex flex-col items-center justify-center gap-2">
        <p>
          BeBrief Studio &copy; 2026 · Edición modular y exportación standalone.
        </p>
        <p className="opacity-80">
          Creado por <a href="https://metalsyntax.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-all">metalsyntax</a>
        </p>
      </footer>
    </div>
  )
}
export default Dashboard
