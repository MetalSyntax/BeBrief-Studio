import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { EditableText } from '../components/ui/EditableText'
import { useProjectStore } from '../lib/store/projectStore'

// Mock the project store
jest.mock('../lib/store/projectStore', () => ({
  useProjectStore: jest.fn(),
}))

describe('EditableText Component Selection and Focus Sync', () => {
  beforeEach(() => {
    (useProjectStore as unknown as jest.Mock).mockReturnValue({
      previewMode: false,
    })
  })

  test('should not overwrite innerHTML when the element is focused to prevent selection/cursor loss', () => {
    const onChangeMock = jest.fn()
    
    // 1. Initial render
    const { rerender } = render(
      <EditableText value="Hello World" onChange={onChangeMock} tagName="span" />
    )
    
    const element = screen.getByText('Hello World')
    expect(element).toBeInTheDocument()
    
    // Mock activeElement to simulate focus
    Object.defineProperty(document, 'activeElement', {
      value: element,
      writable: true,
      configurable: true,
    })
    
    // Simulate user editing the innerHTML locally (typing)
    element.innerHTML = 'Hello World Edited'
    
    // 2. Re-render with the original value prop (e.g. parent re-renders before blur)
    rerender(<EditableText value="Hello World" onChange={onChangeMock} tagName="span" />)
    
    // Check that innerHTML is NOT reset back to "Hello World", keeping user's edit and selection intact
    expect(element.innerHTML).toBe('Hello World Edited')
  })

  test('should overwrite innerHTML when the element is NOT focused and value changes externally', () => {
    const onChangeMock = jest.fn()
    
    // 1. Initial render
    const { rerender } = render(
      <EditableText value="Hello World" onChange={onChangeMock} tagName="span" />
    )
    
    const element = screen.getByText('Hello World')
    
    // Ensure activeElement is NOT this element
    Object.defineProperty(document, 'activeElement', {
      value: document.body,
      writable: true,
      configurable: true,
    })
    
    // 2. Re-render with a new value prop (external change)
    rerender(<EditableText value="New External Value" onChange={onChangeMock} tagName="span" />)
    
    // Check that innerHTML is successfully updated
    expect(element.innerHTML).toBe('New External Value')
  })
})
