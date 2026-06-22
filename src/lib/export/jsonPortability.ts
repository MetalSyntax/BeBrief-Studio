import type { Project } from '../types/project.types'

const SCHEMA_VERSION = 'bbs-v1'

export function exportProjectToJSON(project: Project): string {
  const payload = { _schema: SCHEMA_VERSION, ...project }
  return JSON.stringify(payload, null, 2)
}

export function downloadProjectJSON(project: Project): void {
  const json = exportProjectToJSON(project)
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const safeTitle = project.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'case-study'

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${safeTitle}.bbs.json`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function parseProjectFromJSON(jsonString: string): Project | null {
  try {
    const parsed = JSON.parse(jsonString)

    // Basic schema validation
    if (!parsed || typeof parsed !== 'object') return null
    if (!parsed.id || !parsed.title || !Array.isArray(parsed.sections)) return null

    // Strip meta key, sanitize, assign fresh ID to avoid collisions
    const { _schema: _s, ...projectData } = parsed
    const imported: Project = {
      ...projectData,
      id: `imported-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    }

    return imported
  } catch {
    return null
  }
}
