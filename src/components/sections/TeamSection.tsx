import type { Section, TeamData } from '../../lib/types/project.types'
import { useProjectStore } from '../../lib/store/projectStore'
import { EditableText } from '../ui/EditableText'
import { UserRound } from 'lucide-react'

import { getTitleClass, getAlignmentContainerClass, getTextAlignClass } from '../../lib/utils/styleMapper'

interface Props {
  section: Section & { data: TeamData }
  isEditing: boolean
  onClick?: () => void
}

export function TeamSection({ section, isEditing, onClick }: Props) {
  const { data, style } = section
  const updateSection = useProjectStore((state) => state.updateSection)

  const handleUpdate = (key: keyof TeamData, val: any) => {
    updateSection(section.id, { [key]: val })
  }

  const handleMemberUpdate = (index: number, field: 'name' | 'role', val: string) => {
    const updatedMembers = [...(data.members || [])]
    updatedMembers[index] = { ...updatedMembers[index], [field]: val }
    handleUpdate('members', updatedMembers)
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {data.members?.map((member: any, index: number) => (
            <div key={index} className="flex flex-col items-center text-center gap-3">
              {member.photo ? (
                <img src={member.photo} alt={member.name} className="w-20 h-20 rounded-full object-cover border border-white/10" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
                  <UserRound size={28} />
                </div>
              )}

              <div>
                <EditableText
                  value={member.name}
                  onChange={(val) => handleMemberUpdate(index, 'name', val)}
                  isEditing={isEditing}
                  tagName="div"
                  className="font-bold text-sm text-white"
                />
                <EditableText
                  value={member.role}
                  onChange={(val) => handleMemberUpdate(index, 'role', val)}
                  isEditing={isEditing}
                  tagName="div"
                  className="text-xs opacity-60"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
