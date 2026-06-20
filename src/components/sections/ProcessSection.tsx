import type { Section, ProcessData } from '../../lib/types/project.types'
import { useProjectStore } from '../../lib/store/projectStore'
import { EditableText } from '../ui/EditableText'
import * as LucideIcons from 'lucide-react'

interface Props {
  section: Section & { data: ProcessData }
  isEditing: boolean
  onClick?: () => void
}

export function ProcessSection({ section, isEditing, onClick }: Props) {
  const { data, style } = section
  const updateSection = useProjectStore((state) => state.updateSection)

  const handleUpdate = (key: keyof ProcessData, val: any) => {
    updateSection(section.id, { [key]: val })
  }

  const handleStepUpdate = (index: number, field: 'title' | 'description' | 'icon', val: string) => {
    const updatedSteps = [...(data.steps || [])]
    updatedSteps[index] = { ...updatedSteps[index], [field]: val }
    handleUpdate('steps', updatedSteps)
  }

  return (
    <div
      onClick={onClick}
      style={{
        background: style.background,
        color: style.textColor,
        padding: style.padding || '100px 80px',
      }}
      className={`w-full overflow-hidden transition-all duration-300 ${
        isEditing ? 'ring-2 ring-violet-500 ring-offset-2' : ''
      } cursor-pointer`}
    >
      <div className="max-w-[1120px] mx-auto w-full px-6">
        <div className="flex items-center gap-3 mb-12">
          {data.sectionNumber && (
            <EditableText
              value={data.sectionNumber}
              onChange={(val) => handleUpdate('sectionNumber', val)}
              isEditing={isEditing}
              tagName="span"
              className="font-mono text-sm opacity-60 bg-white/5 border border-white/10 px-2 py-0.5 rounded"
            />
          )}
          
          <EditableText
            value={data.title}
            onChange={(val) => handleUpdate('title', val)}
            isEditing={isEditing}
            tagName="h2"
            className="text-2xl font-bold tracking-tight uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.steps?.map((step: any, index: number) => {
            // Dynamically resolve lucide icons
            const IconComponent = (LucideIcons as any)[step.icon] || LucideIcons.HelpCircle
            
            return (
              <div key={index} className="flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-violet-500/20 transition-all duration-300">
                <div className="absolute top-4 right-4 font-mono text-4xl opacity-5 font-bold group-hover:opacity-10 transition-opacity">
                  0{index + 1}
                </div>
                
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-6 relative">
                  <IconComponent size={22} />
                  
                  {isEditing && (
                    <select
                      value={step.icon || 'HelpCircle'}
                      onChange={(e) => handleStepUpdate(index, 'icon', e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      title="Cambiar Icono"
                    >
                      <option value="Search">Search</option>
                      <option value="Target">Target</option>
                      <option value="Layers">Layers</option>
                      <option value="Zap">Zap</option>
                      <option value="Award">Award</option>
                      <option value="Heart">Heart</option>
                      <option value="Code">Code</option>
                      <option value="Smile">Smile</option>
                      <option value="HelpCircle">HelpCircle</option>
                    </select>
                  )}
                </div>
                
                <EditableText
                  value={step.title}
                  onChange={(val) => handleStepUpdate(index, 'title', val)}
                  isEditing={isEditing}
                  tagName="h3"
                  className="text-lg font-bold text-white mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                />
                
                <EditableText
                  value={step.description}
                  onChange={(val) => handleStepUpdate(index, 'description', val)}
                  isEditing={isEditing}
                  tagName="p"
                  className="text-sm opacity-70 leading-relaxed font-light"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
