import { useProjectStore } from '../lib/store/projectStore'

describe('Zustand Project Store', () => {
  beforeEach(() => {
    // Reset projects to a default state
    useProjectStore.getState().setView('dashboard')
  })

  test('should initialize with default projects', () => {
    const state = useProjectStore.getState()
    expect(state.projects.length).toBeGreaterThan(0)
    expect(state.project).toBeDefined()
    expect(state.view).toBe('dashboard')
  })

  test('should allow creating a new project', () => {
    const store = useProjectStore.getState()
    store.createNewProject('Test Case Study', 'minimal')
    
    const updatedState = useProjectStore.getState()
    expect(updatedState.project.title).toBe('Test Case Study')
    expect(updatedState.project.theme).toBe('minimal')
    expect(updatedState.view).toBe('editor')
  })

  test('should support duplicating a project', () => {
    const store = useProjectStore.getState()
    const initialCount = store.projects.length
    const currentId = store.project.id
    
    store.duplicateProject(currentId)
    
    const updatedState = useProjectStore.getState()
    expect(updatedState.projects.length).toBe(initialCount + 1)
  })

  test('should allow modifying section data', () => {
    const store = useProjectStore.getState()
    store.createNewProject('Editable Test', 'default')
    
    const state = useProjectStore.getState()
    const firstSection = state.project.sections[0]
    
    store.updateSection(firstSection.id, { title: 'Updated Title' })
    
    const finalState = useProjectStore.getState()
    expect(finalState.project.sections[0].data.title).toBe('Updated Title')
  })

  test('should support undo and redo operations', () => {
    const store = useProjectStore.getState()
    store.createNewProject('History Test', 'default')
    
    const state = useProjectStore.getState()
    const originalTitle = state.project.title
    
    // Mutate state
    store.updateProjectTitle('New Title')
    expect(useProjectStore.getState().project.title).toBe('New Title')
    
    // Undo
    store.undo()
    expect(useProjectStore.getState().project.title).toBe(originalTitle)
    
    // Redo
    store.redo()
    expect(useProjectStore.getState().project.title).toBe('New Title')
  })
})
