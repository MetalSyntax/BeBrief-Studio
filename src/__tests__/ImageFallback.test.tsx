import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MockupsSection } from '../components/sections/MockupsSection'
import { useProjectStore } from '../lib/store/projectStore'

jest.mock('../lib/store/projectStore', () => ({
  useProjectStore: jest.fn(),
}))

describe('MockupFrame Image Fallback Cascading', () => {
  beforeEach(() => {
    (useProjectStore as unknown as jest.Mock).mockReturnValue({
      project: { theme: 'minimal', sections: [] },
      updateSection: jest.fn(),
    })
  })

  test('should fallback to Thum.io when Microlink screenshot fails', () => {
    const mockupSectionData = {
      id: 'mockups-1',
      type: 'mockups' as const,
      visible: true,
      order: 1,
      style: { 
        background: '#fff', 
        textColor: '#000', 
        accentColor: '#8b5cf6', 
        radius: '8px' as const 
      },
      data: {
        sectionNumber: '01',
        title: 'My Mockups',
        mockups: [
          {
            image: 'https://api.microlink.io/?url=https%3A%2F%2Fsitefdevenezuela.com%2F&screenshot=true&embed=screenshot.url',
            alt: 'Failed Microlink Site',
            deviceFrame: 'browser' as const,
            scrollOffset: 0
          }
        ],
        layout: 'grid-2' as const
      }
    }

    render(
      <MockupsSection 
        section={mockupSectionData} 
        isEditing={false} 
      />
    )

    // Initially rendering Microlink URL
    const imageEl = screen.getByRole('img') as HTMLImageElement
    expect(imageEl.src).toContain('api.microlink.io')

    // 1. Simulate image error on Microlink
    fireEvent.error(imageEl)

    // Expected fallback 1: Thum.io
    expect(imageEl.src).toContain('image.thum.io')
    expect(imageEl.src).toContain('sitefdevenezuela.com')

    // 2. Simulate image error on Thum.io
    fireEvent.error(imageEl)

    // Expected fallback 2: s-shot.ru
    expect(imageEl.src).toContain('mini.s-shot.ru')

    // 3. Simulate image error on s-shot.ru
    fireEvent.error(imageEl)

    // Expected final fallback: placeholder image from Unsplash
    expect(imageEl.src).toContain('images.unsplash.com')
  })
})
