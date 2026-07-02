import type { Section, AwardsData } from '../../lib/types/project.types'
import { useProjectStore } from '../../lib/store/projectStore'
import { EditableText } from '../ui/EditableText'
import { Award } from 'lucide-react'

import { getTitleClass, getAlignmentContainerClass, getTextAlignClass, getCardRadiusStyle } from '../../lib/utils/styleMapper'

interface Props {
  section: Section & { data: AwardsData }
  isEditing: boolean
  onClick?: () => void
}

export function AwardsSection({ section, isEditing, onClick }: Props) {
  const { data, style } = section
  const updateSection = useProjectStore((state) => state.updateSection)

  const handleUpdate = (key: keyof AwardsData, val: any) => {
    updateSection(section.id, { [key]: val })
  }

  const handleAwardUpdate = (index: number, field: 'title' | 'issuer' | 'year', val: string) => {
    const updatedAwards = [...(data.awards || [])]
    updatedAwards[index] = { ...updatedAwards[index], [field]: val }
    handleUpdate('awards', updatedAwards)
  }

  return (
    <div
      onClick={onClick}
      style={{
        background: style.background,
        color: style.textColor,
        padding: style.padding || '100px 80px',
        '--section-accent': style.accentColor || 'var(--accent)',
      } as React.CSSProperties}
      className={`w-full overflow-hidden transition-all duration-300 ${
        isEditing ? 'ring-2 ring-accent ring-offset-2' : ''
      } cursor-pointer`}
    >
      <div className="max-w-[1120px] mx-auto w-full px-6">
        <div className={`mb-12 ${getAlignmentContainerClass(style.textAlign)}`}>
          {data.sectionNumber && (
            <EditableText
              value={data.sectionNumber}
              onChange={(val) => handleUpdate('sectionNumber', val)}
              isEditing={isEditing}
              tagName="span"
              hidden={style.hideSectionNumber}
              className="font-mono text-sm opacity-60 bg-white/5 border border-white/10 px-2 py-0.5 rounded"
            />
          )}

          <EditableText
            value={data.title}
            onChange={(val) => handleUpdate('title', val)}
            isEditing={isEditing}
            tagName="h2"
            hidden={style.hideTitle}
            className={`${getTitleClass(style.titleSize)} ${getTextAlignClass(style.textAlign)}`}
            style={{ fontFamily: 'var(--font-display)' }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.awards?.map((award: any, index: number) => (
            <div key={index} style={getCardRadiusStyle(style.radius)} className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-5">
              <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                <Award size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <EditableText
                  value={award.title}
                  onChange={(val) => handleAwardUpdate(index, 'title', val)}
                  isEditing={isEditing}
                  tagName="div"
                  className="font-bold text-sm text-white"
                />
                <div className="flex items-center gap-1.5 text-xs opacity-60">
                  <EditableText
                    value={award.issuer}
                    onChange={(val) => handleAwardUpdate(index, 'issuer', val)}
                    isEditing={isEditing}
                    tagName="span"
                  />
                  <span>&middot;</span>
                  <EditableText
                    value={award.year}
                    onChange={(val) => handleAwardUpdate(index, 'year', val)}
                    isEditing={isEditing}
                    tagName="span"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
