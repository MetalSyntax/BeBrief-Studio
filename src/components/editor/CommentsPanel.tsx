import { useState } from 'react'
import { MessageSquare, Send, Trash2, X, User } from 'lucide-react'
import type { Project, Section } from '../../lib/types/project.types'
import { useProjectStore } from '../../lib/store/projectStore'

interface CommentsPanelProps {
  project: Project
  sections: Section[]
  selectedSectionId: string | null
  onSelectSection: (id: string | null) => void
  onClose: () => void
}

export function CommentsPanel({
  project,
  sections,
  selectedSectionId,
  onSelectSection,
  onClose
}: CommentsPanelProps) {
  const { addComment, deleteComment } = useProjectStore()
  const [authorName, setAuthorName] = useState('')
  const [commentText, setCommentText] = useState('')

  // Filter comments based on selected section, or show all if none selected
  const allComments = project.comments || []
  const filteredComments = selectedSectionId
    ? allComments.filter((c) => c.sectionId === selectedSectionId)
    : allComments

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    const name = authorName.trim() || 'Visualizador Anónimo'
    const targetSectionId = selectedSectionId || (sections[0]?.id || '')

    addComment(targetSectionId, name, commentText)
    setCommentText('')
    // Keep author name saved in session state for convenience
  }

  const getSectionTitle = (sectionId: string) => {
    const sec = sections.find((s) => s.id === sectionId)
    if (!sec) return 'Sección general'
    return sec.data.title || `Sección ${sec.type.toUpperCase()}`
  }

  return (
    <div className="w-80 border-l border-white/10 bg-[#111116] flex flex-col h-full z-40 relative">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} className="text-violet-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-white font-mono">
            Comentarios y Feedback
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-white/5 text-zinc-400 hover:text-white cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      {/* Section Filter selector */}
      <div className="p-3 border-b border-white/5 bg-zinc-950/20">
        <label className="text-[9px] font-mono font-bold tracking-wider text-zinc-500 block mb-1 uppercase">
          Filtrar por Sección
        </label>
        <select
          value={selectedSectionId || ''}
          onChange={(e) => onSelectSection(e.target.value || null)}
          className="w-full bg-zinc-900 border border-white/10 rounded px-2 py-1.5 text-xs text-zinc-300 focus:outline-none"
        >
          <option value="">-- Ver todos los comentarios --</option>
          {sections.map((sec) => (
            <option key={sec.id} value={sec.id}>
              {sec.data.sectionNumber ? `${sec.data.sectionNumber}. ` : ''}
              {sec.data.title ? sec.data.title.substring(0, 24) : sec.type}
            </option>
          ))}
        </select>
      </div>

      {/* List of comments */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {filteredComments.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-zinc-600 opacity-40" />
            <p className="text-zinc-500 text-xs">No hay comentarios en esta sección.</p>
            <p className="text-[10px] text-zinc-600">¡Sé el primero en dejar una sugerencia!</p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div key={comment.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2 group relative">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center text-[10px] font-bold">
                  <User size={10} />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-300">{comment.author}</div>
                  <div className="text-[9px] text-zinc-500 font-mono">
                    {new Date(comment.createdAt).toLocaleDateString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              <p className="text-zinc-300 text-xs leading-relaxed whitespace-pre-line">
                {comment.text}
              </p>
              {!selectedSectionId && (
                <div className="text-[9px] text-zinc-500 font-mono bg-white/5 px-2 py-0.5 rounded inline-block">
                  En: {getSectionTitle(comment.sectionId)}
                </div>
              )}

              {/* Action: Delete comment */}
              <button
                onClick={() => deleteComment(comment.id)}
                className="absolute top-2 right-2 p-1 bg-red-500/10 hover:bg-red-500/20 rounded border border-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                title="Eliminar comentario"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add comment Form */}
      <form onSubmit={handleAddComment} className="p-4 border-t border-white/5 bg-zinc-950/40 space-y-3">
        <div>
          <label className="text-[9px] font-mono font-bold tracking-wider text-zinc-500 block mb-1 uppercase">
            Tu Nombre / Rol
          </label>
          <input
            type="text"
            placeholder="Ej: Cliente / Director de Arte"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[9px] font-mono font-bold tracking-wider text-zinc-500 block mb-1 uppercase">
            Comentario {selectedSectionId ? `sobre sección` : ''}
          </label>
          <textarea
            rows={3}
            placeholder={
              selectedSectionId 
                ? "Escribe tu feedback sobre esta sección..." 
                : "Selecciona una sección o escribe un comentario..."
            }
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none resize-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Send size={12} />
          Enviar Comentario
        </button>
      </form>
    </div>
  )
}
