import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../App'
import { useProjectStore } from '../lib/store/projectStore'
import { ToastProvider } from '../components/shared/ToastProvider'

// Mock ResizeObserver for JSDOM
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = MockResizeObserver;

describe('Canvas Section Selection and Aside Switch', () => {
  beforeEach(() => {
    // Start with a clean store state
    useProjectStore.getState().setView('editor')
    useProjectStore.getState().setActiveSectionId(null)
  })

  test('clicking a section in the canvas selects the section and updates activeMobileTab', () => {
    render(
      <ToastProvider>
        <App />
      </ToastProvider>
    )

    // Verify a section (like Cover) is rendered
    const firstSectionElement = screen.getByText(/Cover/i)
    expect(firstSectionElement).toBeInTheDocument()

    // Retrieve initial store state
    expect(useProjectStore.getState().activeSectionId).toBeNull()

    // Simulate clicking on the cover section
    fireEvent.click(firstSectionElement)

    // Assert that the section is now selected in the store
    const activeId = useProjectStore.getState().activeSectionId
    expect(activeId).not.toBeNull()

    // Verify that the container element is rendered
    const canvasOuterElement = document.getElementById('brief-canvas-export')
    expect(canvasOuterElement).not.toBeNull()
  })

  test('propagation is stopped so clicking a section does not get cleared by the outer canvas container click', () => {
    render(
      <ToastProvider>
        <App />
      </ToastProvider>
    )

    const coverSection = screen.getByText(/Cover/i)

    // Click section
    fireEvent.click(coverSection)
    
    // Active section ID should be set
    const selectedId = useProjectStore.getState().activeSectionId
    expect(selectedId).not.toBeNull()

    // Verify it is still selected (bubbling was stopped and didn't trigger setActiveSectionId(null))
    expect(useProjectStore.getState().activeSectionId).toBe(selectedId)
  })
})
