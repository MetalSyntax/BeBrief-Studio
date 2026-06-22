import { useRef, useEffect } from 'react'
import { useProjectStore } from '../../lib/store/projectStore'

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  isEditing?: boolean
  className?: string
  tagName?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  style?: React.CSSProperties
}

export function EditableText(props: EditableTextProps) {
  const { value, onChange, className = '', tagName = 'span', style } = props
  const ref = useRef<HTMLElement>(null)
  const { previewMode } = useProjectStore()

  const isEditable = !previewMode

  // Sync internal ref text only when value changes externally (e.g. undo/redo/theme)
  useEffect(() => {
    if (ref.current) {
      const normalized = ref.current.innerText.replace(/\r\n/g, '\n')
      if (normalized !== value) {
        ref.current.innerText = value
      }
    }
  }, [value])

  const handleBlur = () => {
    if (ref.current) {
      const newText = ref.current.innerText.replace(/\r\n/g, '\n').trimEnd()
      const normalizedValue = value.replace(/\r\n/g, '\n').trimEnd()
      if (newText !== normalizedValue) {
        onChange(newText)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagName !== 'p' && tagName !== 'div' && !e.shiftKey) {
      e.preventDefault()
      ref.current?.blur()
    }
  }

  const Tag = tagName as any

  return (
    <Tag
      ref={ref}
      contentEditable={isEditable}
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`${className} ${
        isEditable 
          ? 'focus:outline-violet-500 focus:bg-white/5 transition-all p-1 -m-1 rounded cursor-text select-text' 
          : ''
      }`}
      style={style}
    />
  )
}
export default EditableText
