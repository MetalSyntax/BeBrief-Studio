import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Copy, AlertTriangle } from 'lucide-react'
import type { Project } from '../../lib/types/project.types'
import { exportProjectToHTML } from '../../lib/export/htmlExporter'
import { useProjectStore } from '../../lib/store/projectStore'
import { useToast } from './ToastProvider'

interface Props {
  project: Project | null
}

export function SharedPreviewView({ project }: Props) {
  const { t, i18n } = useTranslation()
  const toast = useToast()
  const importProject = useProjectStore((state) => state.importProject)

  const lang = (i18n as unknown as { language?: string }).language?.split('-')[0] || 'es'
  const html = useMemo(() => (project ? exportProjectToHTML(project, lang) : ''), [project, lang])

  if (!project) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-4 bg-[#0e0e11] text-zinc-100 p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <AlertTriangle size={26} />
        </div>
        <h1 className="text-lg font-bold">{t('preview.invalidTitle', { defaultValue: 'Enlace de vista previa inválido' })}</h1>
        <p className="text-sm text-zinc-400 max-w-sm">
          {t('preview.invalidBody', { defaultValue: 'Este enlace está dañado, incompleto, o el proyecto ya no está disponible. Pide un enlace nuevo a quien lo compartió.' })}
        </p>
        <a
          href={window.location.pathname}
          className="mt-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-colors"
        >
          {t('preview.backHome', { defaultValue: 'Ir a BeBrief Studio' })}
        </a>
      </div>
    )
  }

  const handleDuplicate = () => {
    const duplicated: Project = {
      ...JSON.parse(JSON.stringify(project)),
      id: `project-shared-${Date.now()}`,
      title: `${project.title} (${t('dashboard.copySuffix', { defaultValue: 'Copia' })})`,
      updatedAt: new Date().toISOString(),
    }
    importProject(duplicated)
    toast.success(t('preview.duplicated', { defaultValue: '¡Proyecto duplicado! Ya puedes editarlo.' }))
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0e0e11]">
      <header className="h-12 shrink-0 bg-[#13131a] border-b border-white/5 px-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full shrink-0">
            {t('preview.readOnlyBadge', { defaultValue: 'Solo lectura' })}
          </span>
          <span className="text-xs text-zinc-300 font-medium truncate">{project.title}</span>
        </div>
        <button
          onClick={handleDuplicate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-[11px] font-bold transition-colors shrink-0"
        >
          <Copy size={12} />
          {t('preview.duplicateCta', { defaultValue: 'Duplicar y editar' })}
        </button>
      </header>
      <iframe
        title={project.title}
        srcDoc={html}
        sandbox="allow-same-origin"
        className="flex-1 w-full border-0 bg-white"
      />
    </div>
  )
}
