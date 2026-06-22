import { useEffect } from 'react'
import { useProjectStore } from '../lib/store/projectStore'

export function useKeyboardShortcuts() {
  const { undo, redo, setActiveSectionId, previewMode } = useProjectStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const mod = isMac ? e.metaKey : e.ctrlKey

      if (!mod) {
        if (e.key === 'Escape' && !previewMode) {
          setActiveSectionId(null)
        }
        return
      }

      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
        return
      }

      if ((e.key === 'z' && e.shiftKey) || (!isMac && e.key === 'y')) {
        e.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, setActiveSectionId, previewMode])
}
