import type { Section, TechStackData } from '../../lib/types/project.types'
import { useProjectStore } from '../../lib/store/projectStore'
import { EditableText } from '../ui/EditableText'

import { getTitleClass, getAlignmentContainerClass, getTextAlignClass, getCardRadiusStyle } from '../../lib/utils/styleMapper'

interface Props {
  section: Section & { data: TechStackData }
  isEditing: boolean
  onClick?: () => void
}

export function TechStackSection({ section, isEditing, onClick }: Props) {
  const { data, style } = section
  const updateSection = useProjectStore((state) => state.updateSection)

  const handleUpdate = (key: keyof TechStackData, val: any) => {
    updateSection(section.id, { [key]: val })
  }

  const handleItemUpdate = (index: number, field: 'name' | 'category', val: string) => {
    const updatedItems = [...(data.items || [])]
    updatedItems[index] = { ...updatedItems[index], [field]: val }
    handleUpdate('items', updatedItems)
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

        <div className="flex flex-wrap gap-3">
          {data.items?.map((item: any, index: number) => (
            <div key={index} style={getCardRadiusStyle(style.radius, '999px')} className="flex flex-col bg-white/[0.02] border border-white/5 px-5 py-3 min-w-[120px]">
              <EditableText
                value={item.name}
                onChange={(val) => handleItemUpdate(index, 'name', val)}
                isEditing={isEditing}
                tagName="div"
                className="font-bold text-sm text-white"
              />
              {(item.category || isEditing) && (
                <EditableText
                  value={item.category}
                  onChange={(val) => handleItemUpdate(index, 'category', val)}
                  isEditing={isEditing}
                  tagName="div"
                  className="text-[10px] font-mono uppercase tracking-wider opacity-50"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
