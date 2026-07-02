import { create } from 'zustand'
import type { Project, Section, ThemeId, SectionType, ThemeTokens } from '../types/project.types'
import { defaultSections } from '../templates/defaultSections'
import { applyTheme } from '../themes'
import { getSectionManifestEntry } from '../sections/manifest'
import i18n from '../i18n'

interface ProjectState {
  projects: Project[]
  project: Project
  activeSectionId: string | null
  view: 'dashboard' | 'editor'
  past: Project[]
  future: Project[]
  previewMode: boolean
  
  // Actions
  setView: (view: 'dashboard' | 'editor') => void
  setActiveSectionId: (id: string | null) => void
  setPreviewMode: (mode: boolean) => void
  updateSection: (sectionId: string, dataPatch: any) => void
  updateSectionStyle: (sectionId: string, stylePatch: any) => void
  setTheme: (themeId: ThemeId) => void
  updateCustomTheme: (tokensPatch: Partial<ThemeTokens>) => void
  reorderSections: (sections: Section[]) => void
  addSection: (type: SectionType) => void
  deleteSection: (sectionId: string) => void
  duplicateSection: (sectionId: string) => void
  toggleSectionVisibility: (sectionId: string) => void
  undo: () => void
  redo: () => void
  
  // Multi-project Actions
  createNewProject: (title?: string, templateType?: 'default' | 'minimal' | 'editorial' | 'brutalist' | 'cyberpunk' | 'nordic') => void
  deleteProject: (id: string) => void
  duplicateProject: (id: string) => void
  selectProject: (id: string) => void
  updateProjectTitle: (title: string) => void
  importProject: (project: Project) => void
  addComment: (sectionId: string, author: string, text: string) => void
  deleteComment: (commentId: string) => void
}

const createInitialProject = (id = 'default-project', title = 'Mi Case Study de Behance', theme: ThemeId = 'dark-editorial'): Project => {
  return {
    id,
    title,
    theme,
    sections: JSON.parse(JSON.stringify(defaultSections)),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// LocalStorage helpers
const loadProjectsFromLS = (): Project[] => {
  try {
    const saved = localStorage.getItem('bbb_projects')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.error('Error loading projects from LocalStorage', e)
  }
  return [createInitialProject()]
}

const saveProjectsToLS = (projects: Project[]) => {
  try {
    localStorage.setItem('bbb_projects', JSON.stringify(projects))
  } catch (e) {
    console.error('Error saving projects to LocalStorage', e)
  }
}

const initialProjects = loadProjectsFromLS()
const initialProject = initialProjects[0]
setTimeout(() => applyTheme(initialProject.theme, initialProject.customTheme), 0)

export const useProjectStore = create<ProjectState>((set, get) => {
  const saveToHistory = (currentProject: Project) => {
    const { past } = get()
    const newPast = [...past, JSON.parse(JSON.stringify(currentProject))].slice(-30)
    return {
      past: newPast,
      future: [],
    }
  }

  // Helper to update active project in the projects array and save to LocalStorage
  const syncProjectsList = (updatedProject: Project) => {
    const { projects } = get()
    const newProjects = projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    saveProjectsToLS(newProjects)
    return { projects: newProjects }
  }

  return {
    projects: initialProjects,
    project: initialProject,
    activeSectionId: null,
    view: 'dashboard',
    past: [],
    future: [],
    previewMode: false,

    setView: (view) => set({ view }),
    setActiveSectionId: (id) => set({ activeSectionId: id }),
    setPreviewMode: (mode) => set({ previewMode: mode }),

    updateSection: (sectionId, dataPatch) => {
      const { project } = get()
      const historyUpdate = saveToHistory(project)
      
      const newSections = project.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            data: { ...section.data, ...dataPatch },
          }
        }
        return section
      })

      const newProject = {
        ...project,
        sections: newSections,
        updatedAt: new Date().toISOString(),
      }

      set({
        project: newProject,
        ...historyUpdate,
        ...syncProjectsList(newProject),
      })
    },

    updateSectionStyle: (sectionId, stylePatch) => {
      const { project } = get()
      const historyUpdate = saveToHistory(project)
      
      const newSections = project.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            style: { ...section.style, ...stylePatch },
          }
        }
        return section
      })

      const newProject = {
        ...project,
        sections: newSections,
        updatedAt: new Date().toISOString(),
      }

      set({
        project: newProject,
        ...historyUpdate,
        ...syncProjectsList(newProject),
      })
    },

    setTheme: (themeId) => {
      const { project } = get()
      const historyUpdate = saveToHistory(project)
      
      applyTheme(themeId, project.customTheme)

      const newProject = {
        ...project,
        theme: themeId,
        updatedAt: new Date().toISOString(),
      }

      set({
        project: newProject,
        ...historyUpdate,
        ...syncProjectsList(newProject),
      })
    },

    updateCustomTheme: (tokensPatch) => {
      const { project } = get()
      const historyUpdate = saveToHistory(project)
      
      const currentCustom = project.customTheme || {
        '--bg': '#0f0f12',
        '--bg-section': '#16161f',
        '--bg-card': '#20202e',
        '--text': '#ffffff',
        '--text-muted': '#a1a1aa',
        '--accent': '#8b5cf6',
        '--border': 'rgba(255,255,255,0.08)',
        '--font-display': "'Inter', sans-serif",
        '--font-body': "'Inter', sans-serif",
        '--radius': '12px',
        '--section-w': '1600px',
      }
      
      const newCustomTheme = {
        ...currentCustom,
        ...tokensPatch
      }
      
      const newProject = {
        ...project,
        customTheme: newCustomTheme,
        updatedAt: new Date().toISOString(),
      }
      
      if (project.theme === 'custom') {
        applyTheme('custom', newCustomTheme)
      }
      
      set({
        project: newProject,
        ...historyUpdate,
        ...syncProjectsList(newProject),
      })
    },

    reorderSections: (sections) => {
      const { project } = get()
      const historyUpdate = saveToHistory(project)

      const updatedSections = sections.map((sec, index) => ({
        ...sec,
        order: index,
      }))

      const newProject = {
        ...project,
        sections: updatedSections,
        updatedAt: new Date().toISOString(),
      }

      set({
        project: newProject,
        ...historyUpdate,
        ...syncProjectsList(newProject),
      })
    },

    addSection: (type) => {
      const { project } = get()
      const historyUpdate = saveToHistory(project)

      const manifestEntry = getSectionManifestEntry(type)
      const defaultData: any = manifestEntry ? manifestEntry.defaultData() : {}
      const defaultStyle: any = {
        background: 'var(--bg)',
        textColor: 'var(--text)',
        accentColor: 'var(--accent)',
        padding: '100px 80px',
        width: '1600px',
        ...(manifestEntry?.defaultStyle ? manifestEntry.defaultStyle() : {}),
      }

      const newSection: Section = {
        id: `${type}-${Date.now()}`,
        type,
        order: project.sections.length,
        visible: true,
        data: defaultData,
        style: defaultStyle,
      }

      const newProject = {
        ...project,
        sections: [...project.sections, newSection],
        updatedAt: new Date().toISOString(),
      }

      set({
        project: newProject,
        activeSectionId: newSection.id,
        ...historyUpdate,
        ...syncProjectsList(newProject),
      })
    },

    deleteSection: (sectionId) => {
      const { project } = get()
      const historyUpdate = saveToHistory(project)

      const filteredSections = project.sections.filter((s) => s.id !== sectionId)
      const updatedSections = filteredSections.map((sec, index) => ({
        ...sec,
        order: index,
      }))

      const newProject = {
        ...project,
        sections: updatedSections,
        updatedAt: new Date().toISOString(),
      }

      set({
        project: newProject,
        activeSectionId: null,
        ...historyUpdate,
        ...syncProjectsList(newProject),
      })
    },

    duplicateSection: (sectionId) => {
      const { project } = get()
      const historyUpdate = saveToHistory(project)

      const sourceIndex = project.sections.findIndex(s => s.id === sectionId)
      if (sourceIndex === -1) return

      const source = project.sections[sourceIndex]
      const clone: Section = {
        ...JSON.parse(JSON.stringify(source)),
        id: `${source.type}-${Date.now()}`,
        order: sourceIndex + 1,
      }

      const newSections = [
        ...project.sections.slice(0, sourceIndex + 1),
        clone,
        ...project.sections.slice(sourceIndex + 1),
      ].map((sec, idx) => ({ ...sec, order: idx }))

      const newProject = {
        ...project,
        sections: newSections,
        updatedAt: new Date().toISOString(),
      }

      set({
        project: newProject,
        activeSectionId: clone.id,
        ...historyUpdate,
        ...syncProjectsList(newProject),
      })
    },

    toggleSectionVisibility: (sectionId) => {
      const { project } = get()
      const historyUpdate = saveToHistory(project)

      const newSections = project.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            visible: !section.visible,
          }
        }
        return section
      })

      const newProject = {
        ...project,
        sections: newSections,
        updatedAt: new Date().toISOString(),
      }

      set({
        project: newProject,
        ...historyUpdate,
        ...syncProjectsList(newProject),
      })
    },

    undo: () => {
      const { past, project, future } = get()
      if (past.length === 0) return

      const prevProject = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)
      const newFuture = [JSON.parse(JSON.stringify(project)), ...future]

      applyTheme(prevProject.theme, prevProject.customTheme)

      set({
        project: prevProject,
        past: newPast,
        future: newFuture,
        ...syncProjectsList(prevProject),
      })
    },

    redo: () => {
      const { past, project, future } = get()
      if (future.length === 0) return

      const nextProject = future[0]
      const newFuture = future.slice(1)
      const newPast = [...past, JSON.parse(JSON.stringify(project))]

      applyTheme(nextProject.theme, nextProject.customTheme)

      set({
        project: nextProject,
        past: newPast,
        future: newFuture,
        ...syncProjectsList(nextProject),
      })
    },

    // Multi-project Actions implementation
    createNewProject: (title, templateType = 'default') => {
      const { projects } = get()
      const newId = `project-${Date.now()}`
      let newTheme: ThemeId = 'dark-editorial'
      
      if (templateType === 'minimal') newTheme = 'minimal'
      if (templateType === 'editorial') newTheme = 'clean-light'
      if (templateType === 'brutalist') newTheme = 'brutalist-light'
      if (templateType === 'cyberpunk') newTheme = 'cyberpunk'
      if (templateType === 'nordic') newTheme = 'nordic-cold'

      const actualTitle = title || i18n.t('dashboard.newCaseStudyDefaultTitle', { defaultValue: 'Nuevo Case Study' })
      const newProj = createInitialProject(newId, actualTitle, newTheme)
      
      const newProjects = [...projects, newProj]
      saveProjectsToLS(newProjects)

      applyTheme(newProj.theme, newProj.customTheme)

      set({
        projects: newProjects,
        project: newProj,
        view: 'editor',
        activeSectionId: null,
        past: [],
        future: [],
      })
    },

    deleteProject: (id) => {
      const { projects, project } = get()
      if (projects.length <= 1) return

      const newProjects = projects.filter((p) => p.id !== id)
      saveProjectsToLS(newProjects)

      // If active project got deleted, pick the first one from remaining list
      let nextProject = project
      if (project.id === id) {
        nextProject = newProjects[0]
        applyTheme(nextProject.theme, nextProject.customTheme)
      }

      set({
        projects: newProjects,
        project: nextProject,
        activeSectionId: null,
        past: [],
        future: [],
      })
    },

    duplicateProject: (id) => {
      const { projects } = get()
      const source = projects.find((p) => p.id === id)
      if (!source) return

      const duplicate: Project = JSON.parse(JSON.stringify(source))
      duplicate.id = `project-dup-${Date.now()}`
      duplicate.title = `${source.title} ${i18n.t('dashboard.copySuffix', { defaultValue: '(Copia)' })}`
      duplicate.createdAt = new Date().toISOString()
      duplicate.updatedAt = new Date().toISOString()

      const newProjects = [...projects, duplicate]
      saveProjectsToLS(newProjects)

      set({
        projects: newProjects,
      })
    },

    selectProject: (id) => {
      const { projects } = get()
      const target = projects.find((p) => p.id === id)
      if (!target) return

      applyTheme(target.theme, target.customTheme)

      set({
        project: target,
        view: 'editor',
        activeSectionId: null,
        past: [],
        future: [],
      })
    },

    updateProjectTitle: (title) => {
      const { project } = get()
      const historyUpdate = saveToHistory(project)
      const newProject = {
        ...project,
        title,
        updatedAt: new Date().toISOString(),
      }

      set({
        project: newProject,
        ...historyUpdate,
        ...syncProjectsList(newProject),
      })
    },

    importProject: (imported) => {
      const { projects } = get()
      const exists = projects.some((p) => p.id === imported.id)
      const finalProject = exists
        ? { ...imported, id: `project-import-${Date.now()}` }
        : imported
      const newProjects = [...projects, finalProject]
      saveProjectsToLS(newProjects)
      applyTheme(finalProject.theme, finalProject.customTheme)
      set({
        projects: newProjects,
        project: finalProject,
        view: 'editor',
        activeSectionId: null,
        past: [],
        future: [],
      })
    },

    addComment: (sectionId, author, text) => {
      const { project } = get()
      const newComment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        sectionId,
        author,
        text,
        createdAt: new Date().toISOString()
      }
      const updatedProject = {
        ...project,
        comments: [...(project.comments || []), newComment],
        updatedAt: new Date().toISOString()
      }
      set({
        project: updatedProject,
        ...syncProjectsList(updatedProject)
      })
    },

    deleteComment: (commentId) => {
      const { project } = get()
      const updatedProject = {
        ...project,
        comments: (project.comments || []).filter((c: any) => c.id !== commentId),
        updatedAt: new Date().toISOString()
      }
      set({
        project: updatedProject,
        ...syncProjectsList(updatedProject)
      })
    },
  }
})
