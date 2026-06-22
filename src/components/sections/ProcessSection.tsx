import React, { useState } from 'react'
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
  const [activeIconPicker, setActiveIconPicker] = useState<number | null>(null)

  const handleUpdate = (key: keyof ProcessData, val: any) => {
    updateSection(section.id, { [key]: val })
  }

  const handleStepUpdate = (index: number, field: 'title' | 'description' | 'icon', val: string) => {
    const updatedSteps = [...(data.steps || [])]
    updatedSteps[index] = { ...updatedSteps[index], [field]: val }
    handleUpdate('steps', updatedSteps)
  }

  return (
    <section
      onClick={onClick}
      style={{
        background: style.background,
        color: style.textColor,
        padding: style.padding || '100px 80px',
      } as React.CSSProperties}
      className={`relative border-b border-white/5 transition-all duration-300 ${
        isEditing ? 'ring-2 ring-violet-500/50' : ''
      }`}
    >
      <div 
        style={{ maxWidth: style.width || '1600px' }}
        className="mx-auto px-6 lg:px-16 py-12"
      >
        <div className="flex flex-col gap-2 mb-12">
          {data.sectionNumber && (
            <EditableText
              value={data.sectionNumber}
              onChange={(val) => handleUpdate('sectionNumber', val)}
              isEditing={isEditing}
              tagName="span"
              className="text-xs font-bold font-mono tracking-widest text-violet-400 uppercase"
            />
          )}
          
          <EditableText
            value={data.title}
            onChange={(val) => handleUpdate('title', val)}
            isEditing={isEditing}
            tagName="h2"
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.steps?.map((step: any, index: number) => {
            const IconComponent = (LucideIcons as any)[step.icon] || LucideIcons.HelpCircle
            
            return (
              <div key={index} className="flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-violet-500/20 transition-all duration-300">
                <div className="absolute top-4 right-4 font-mono text-4xl opacity-5 font-bold group-hover:opacity-10 transition-opacity">
                  0{index + 1}
                </div>
                
                <div 
                  className={`w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-6 relative ${
                    isEditing ? 'cursor-pointer hover:bg-violet-500/20 hover:border-violet-500/30' : ''
                  }`}
                  onClick={(e) => {
                    if (isEditing) {
                      e.stopPropagation()
                      setActiveIconPicker(activeIconPicker === index ? null : index)
                    }
                  }}
                >
                  <IconComponent size={22} />
                  
                  {isEditing && activeIconPicker === index && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={(e) => {
                        e.stopPropagation()
                        setActiveIconPicker(null)
                      }} />
                      <div className="absolute top-14 left-0 bg-[#13131a] border border-white/10 rounded-xl shadow-2xl z-50 p-2 grid grid-cols-3 gap-1.5 w-36">
                        {[
                          { name: 'Search', icon: LucideIcons.Search },
                          { name: 'Target', icon: LucideIcons.Target },
                          { name: 'Layers', icon: LucideIcons.Layers },
                          { name: 'Zap', icon: LucideIcons.Zap },
                          { name: 'Award', icon: LucideIcons.Award },
                          { name: 'Heart', icon: LucideIcons.Heart },
                          { name: 'Code', icon: LucideIcons.Code },
                          { name: 'Smile', icon: LucideIcons.Smile },
                          { name: 'HelpCircle', icon: LucideIcons.HelpCircle }
                        ].map(({ name, icon: PickerIcon }) => (
                          <button
                            key={name}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStepUpdate(index, 'icon', name)
                              setActiveIconPicker(null)
                            }}
                            className={`p-2 rounded-lg hover:bg-white/5 flex items-center justify-center transition-all ${
                              step.icon === name ? 'text-violet-400 bg-violet-500/10' : 'text-zinc-400'
                            }`}
                            title={name}
                          >
                            <PickerIcon size={16} />
                          </button>
                        ))}
                      </div>
                    </>
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
    </section>
  )
}
