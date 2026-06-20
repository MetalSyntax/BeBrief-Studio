import { exportProjectToHTML } from '../lib/export/htmlExporter'
import type { Project } from '../lib/types/project.types'
import { defaultSections } from '../lib/templates/defaultSections'

describe('HTML Exporter', () => {
  const dummyProject: Project = {
    id: 'test-proj',
    title: 'Visual Showcase Test',
    theme: 'dark-editorial',
    sections: [defaultSections[0]], // Just Cover section
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  test('should compile project to HTML string', () => {
    const html = exportProjectToHTML(dummyProject)
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('<title>Visual Showcase Test</title>')
    expect(html).toContain('UI/UX CASE STUDY') // eyebrow value
  })

  test('should generate CSS styling variables matching theme', () => {
    const html = exportProjectToHTML(dummyProject)
    expect(html).toContain('--bg: #0E0B09;')
    expect(html).toContain('--font-display: \'Montserrat\', sans-serif;')
  })
})
