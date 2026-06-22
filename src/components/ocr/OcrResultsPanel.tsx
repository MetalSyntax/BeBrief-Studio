import { Check, AlertCircle, RefreshCw } from 'lucide-react'
import type { OcrBlock } from '../../lib/ocr/ocrEngine'
import type { FieldMappingSuggestion } from '../../lib/ocr/textMapper'
import { CustomSelect } from '../ui/CustomSelect'

interface Props {
  blocks: OcrBlock[]
  suggestions: FieldMappingSuggestion[]
  sectionType: string
  mappings: Record<number, string> // maps blockIndex -> fieldName
  onMappingChange: (blockIndex: number, fieldName: string) => void
  onBlockTextChange: (blockIndex: number, newText: string) => void
  onApply: () => void
  onReset: () => void
}

export function OcrResultsPanel({
  blocks,
  suggestions,
  sectionType,
  mappings,
  onMappingChange,
  onBlockTextChange,
  onApply,
  onReset
}: Props) {
  // Get available fields based on section type
  const getAvailableFields = () => {
    const fields = [{ value: 'none', label: 'Ninguno / Ignorar' }]

    switch (sectionType) {
      case 'cover':
        fields.push(
          { value: 'title', label: 'Título Principal' },
          { value: 'subtitle', label: 'Subtítulo' },
          { value: 'eyebrow', label: 'Eyebrow (Etiqueta)' },
          { value: 'pageCounter', label: 'Contador de Página' }
        )
        break
      case 'overview':
        fields.push(
          { value: 'title', label: 'Título Sección' },
          { value: 'contextText', label: 'Párrafo de Contexto' },
          { value: 'metric.label', label: 'Métrica: Etiqueta (Rol/Duración)' },
          { value: 'metric.value', label: 'Métrica: Valor (Diseñador/1 Mes)' }
        )
        break
      case 'problem':
      case 'ux-flow':
      case 'mockups':
        fields.push(
          { value: 'sectionNumber', label: 'Número Sección' },
          { value: 'title', label: 'Título' },
          { value: 'description', label: 'Descripción / Texto' }
        )
        break
      case 'results':
        fields.push(
          { value: 'sectionNumber', label: 'Número Sección' },
          { value: 'title', label: 'Título' },
          { value: 'description', label: 'Descripción / Texto' },
          { value: 'metric.label', label: 'Métrica: Etiqueta (Conversión)' },
          { value: 'metric.value', label: 'Métrica: Valor (+15%)' }
        )
        break
      case 'process':
        fields.push(
          { value: 'sectionNumber', label: 'Número Sección' },
          { value: 'title', label: 'Título Proceso' },
          { value: 'item.title', label: 'Paso: Título (Investigación)' },
          { value: 'item.value', label: 'Paso: Descripción' }
        )
        break
      case 'color-palette':
        fields.push(
          { value: 'sectionNumber', label: 'Número Sección' },
          { value: 'title', label: 'Título Paleta' },
          { value: 'item.title', label: 'Color: Nombre' },
          { value: 'item.value', label: 'Color: Rol (HEX/Descripción)' }
        )
        break
      default:
        fields.push(
          { value: 'sectionNumber', label: 'Número Sección' },
          { value: 'title', label: 'Título' },
          { value: 'description', label: 'Descripción / Texto' }
        )
    }

    return fields
  }

  const fields = getAvailableFields()

  return (
    <div className="space-y-6 flex flex-col h-[550px]">
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
        <div className="bg-zinc-950/40 border border-white/5 rounded-xl p-3 text-xs text-zinc-400">
          Revisa el texto extraído y asígnalo a los campos del brief. Puedes editar el texto directamente en las cajas si es necesario.
        </div>

        {blocks.map((block, index) => {
          const mapping = mappings[index] || 'none'
          const isLowConfidence = block.confidence < 45
          const suggestion = suggestions.find(s => s.blockIndex === index)

          return (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-all ${
                mapping !== 'none'
                  ? 'bg-violet-600/[0.03] border-violet-500/25'
                  : 'bg-zinc-900/40 border-white/5'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-400 font-mono">
                    Bloque #{index + 1}
                  </span>
                  
                  {isLowConfidence && (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      <AlertCircle size={10} /> Precisión Baja ({block.confidence}%)
                    </span>
                  )}
                  
                  {!isLowConfidence && (
                    <span className="text-[9px] text-zinc-500 font-mono">
                      Confianza: {block.confidence}%
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 font-medium font-mono uppercase">Asignar a:</span>
                  <CustomSelect
                    value={mapping}
                    onChange={(val) => onMappingChange(index, val)}
                    options={fields.map(f => ({
                      value: f.value,
                      label: `${f.label}${suggestion?.suggestedField === f.value && mapping === 'none' ? ' (Sugerido)' : ''}`
                    }))}
                    triggerClassName="bg-zinc-950/80 hover:bg-zinc-900 px-2 py-1 text-xs"
                    dropdownClassName="right-0 left-auto"
                  />
                </div>
              </div>

              <textarea
                value={block.text}
                onChange={(e) => onBlockTextChange(index, e.target.value)}
                rows={Math.min(4, block.text.split('\n').length || 1)}
                className="w-full bg-zinc-950/80 border border-white/10 hover:border-white/20 focus:border-violet-500 focus:outline-none rounded-lg p-2.5 text-xs text-white resize-y font-sans leading-relaxed"
              />
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-4 bg-[#18181f]">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-white/5 hover:border-white/10 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <RefreshCw size={14} />
          <span>Volver a subir</span>
        </button>

        <button
          type="button"
          onClick={onApply}
          className="flex items-center gap-1.5 px-5 py-2 bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-500/20 text-xs font-bold text-white rounded-xl transition-all"
        >
          <Check size={14} />
          <span>Importar al Brief</span>
        </button>
      </div>
    </div>
  )
}
