import type { Section, TestimonialData } from '../../lib/types/project.types'
import { useProjectStore } from '../../lib/store/projectStore'
import { EditableText } from '../ui/EditableText'
import { Quote, UserRound } from 'lucide-react'

import { getTextAlignClass } from '../../lib/utils/styleMapper'

interface Props {
  section: Section & { data: TestimonialData }
  isEditing: boolean
  onClick?: () => void
}

export function TestimonialSection({ section, isEditing, onClick }: Props) {
  const { data, style } = section
  const updateSection = useProjectStore((state) => state.updateSection)

  const handleUpdate = (key: keyof TestimonialData, val: any) => {
    updateSection(section.id, { [key]: val })
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
      <div className={`max-w-[880px] mx-auto w-full px-6 flex flex-col ${style.textAlign === 'left' ? 'items-start' : 'items-center'}`}>
        <Quote size={36} className="text-accent opacity-70 mb-6" />

        <EditableText
          value={data.quote}
          onChange={(val) => handleUpdate('quote', val)}
          isEditing={isEditing}
          tagName="p"
          hidden={style.hideDescription}
          className={`text-2xl md:text-3xl font-light leading-snug mb-8 ${getTextAlignClass(style.textAlign || 'center')}`}
          style={{ fontFamily: 'var(--font-display)' }}
        />

        <div className="flex items-center gap-3">
          {data.authorPhoto ? (
            <img src={data.authorPhoto} alt={data.authorName} className="w-12 h-12 rounded-full object-cover border border-white/10" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 shrink-0">
              <UserRound size={20} />
            </div>
          )}

          <div className={getTextAlignClass(style.textAlign || 'center', 'text-left')}>
            <EditableText
              value={data.authorName}
              onChange={(val) => handleUpdate('authorName', val)}
              isEditing={isEditing}
              tagName="div"
              className="font-bold text-sm text-white"
            />
            <EditableText
              value={data.authorRole}
              onChange={(val) => handleUpdate('authorRole', val)}
              isEditing={isEditing}
              tagName="div"
              className="text-xs opacity-60"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
