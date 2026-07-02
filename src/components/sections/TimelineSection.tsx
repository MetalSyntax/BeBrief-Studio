import type { Section, TimelineData } from '../../lib/types/project.types'
import { useProjectStore } from '../../lib/store/projectStore'
import { EditableText } from '../ui/EditableText'

import { getTitleClass, getAlignmentContainerClass, getTextAlignClass } from '../../lib/utils/styleMapper'

interface Props {
  section: Section & { data: TimelineData }
  isEditing: boolean
  onClick?: () => void
}

export function TimelineSection({ section, isEditing, onClick }: Props) {
  const { data, style } = section
  const updateSection = useProjectStore((state) => state.updateSection)

  const handleUpdate = (key: keyof TimelineData, val: any) => {
    updateSection(section.id, { [key]: val })
  }

  const handleMilestoneUpdate = (index: number, field: 'date' | 'title' | 'description', val: string) => {
    const updatedMilestones = [...(data.milestones || [])]
    updatedMilestones[index] = { ...updatedMilestones[index], [field]: val }
    handleUpdate('milestones', updatedMilestones)
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

        <div className="relative border-l border-white/10 ml-2 space-y-10">
          {data.milestones?.map((milestone: any, index: number) => (
            <div key={index} className="relative pl-8">
              <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-accent border-2 border-[var(--bg,#0e0e11)]" />

              <EditableText
                value={milestone.date}
                onChange={(val) => handleMilestoneUpdate(index, 'date', val)}
                isEditing={isEditing}
                tagName="div"
                className="font-mono text-xs uppercase tracking-wider text-accent font-bold mb-1"
              />
              <EditableText
                value={milestone.title}
                onChange={(val) => handleMilestoneUpdate(index, 'title', val)}
                isEditing={isEditing}
                tagName="h3"
                className="font-bold text-base text-white mb-1"
                style={{ fontFamily: 'var(--font-display)' }}
              />
              <EditableText
                value={milestone.description}
                onChange={(val) => handleMilestoneUpdate(index, 'description', val)}
                isEditing={isEditing}
                tagName="p"
                className="text-sm opacity-70 leading-relaxed font-light"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
