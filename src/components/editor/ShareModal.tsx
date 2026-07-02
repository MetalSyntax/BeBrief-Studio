import { useState } from 'react'
import { X, Copy, Check, Share2, Globe, Sparkles, MessageSquare } from 'lucide-react'
import type { Project } from '../../lib/types/project.types'
import { compressAndEncodeProject } from '../../lib/utils/shareHelper'
import { useToast } from '../shared/ToastProvider'

interface ShareModalProps {
  project: Project
  onClose: () => void
}

export function ShareModal({ project, onClose }: ShareModalProps) {
  const toast = useToast()
  const [copied, setCopied] = useState(false)
  const [isPublished, setIsPublished] = useState(false)

  // Generate URL using window location and the compressed project payload
  const payload = compressAndEncodeProject(project)
  const shareUrl = `${window.location.origin}${window.location.pathname}?share=${payload}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success('¡Enlace de visualización copiado al portapapeles!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePublish = () => {
    // Save to local storage community list to simulate cloud publishing
    try {
      const existing = localStorage.getItem('bbb_community_published')
      const publishedList = existing ? JSON.parse(existing) : []
      
      // Prevent duplicates
      if (!publishedList.some((id: string) => id === project.id)) {
        publishedList.push(project.id)
        localStorage.setItem('bbb_community_published', JSON.stringify(publishedList))
        
        // Also save a copy of the project data in a custom storage key
        localStorage.setItem(`bbb_community_project_${project.id}`, JSON.stringify(project))
      }
      
      setIsPublished(true)
      toast.success('¡Tu Case Study ha sido publicado en la Galería de la Comunidad!')
    } catch (e) {
      console.error(e)
      toast.error('Error al publicar la plantilla.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#13131a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 size={16} className="text-violet-400" />
            <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">Colaboración y Comunidad</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Share read-only link */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 block uppercase">
                Enlace de Vista Previa (Solo Lectura)
              </label>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Globe size={10} /> Local-first Serverless
              </span>
            </div>
            
            <p className="text-zinc-400 text-xs leading-relaxed">
              Comparte este enlace con tus clientes o equipo. Podrán visualizar todo el Case Study en modo de presentación, y dejar comentarios específicos por sección sin alterar tu diseño.
            </p>

            <div className="flex items-center gap-2 mt-3">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-zinc-900 border border-white/10 rounded-lg text-xs px-3 py-2.5 text-zinc-400 select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Publish to community */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 block uppercase">
                Galería de Plantillas de la Comunidad
              </label>
              <span className="text-[10px] text-violet-400 font-mono flex items-center gap-1">
                <Sparkles size={10} /> Comunidad
              </span>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed">
              Publica tu diseño actual como una plantilla en la Galería de la Comunidad local. Otros usuarios podrán usarla como base o duplicarla para sus propios proyectos.
            </p>

            {isPublished ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-medium flex items-center gap-2">
                <Check size={14} /> ¡Publicado con éxito en tu Galería de Plantillas!
              </div>
            ) : (
              <button
                onClick={handlePublish}
                className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 hover:text-white border border-white/10 hover:border-white/20 rounded-lg text-zinc-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles size={14} className="text-yellow-400" />
                Publicar como Plantilla de la Comunidad
              </button>
            )}
          </div>

          {/* Interactive feedback card */}
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-zinc-300 text-xs font-semibold">
              <MessageSquare size={13} className="text-violet-400" />
              <span>Sistema de Feedback Integrado</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Cualquier persona que reciba tu enlace de vista previa podrá añadir comentarios y notas sobre secciones individuales. Estos comentarios quedarán grabados en el brief.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-950/40 border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
