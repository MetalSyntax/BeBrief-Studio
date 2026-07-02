import type { Project } from '../types/project.types'

const SCHEMA_VERSION = 'bbs-v1'
const KNOWN_SCHEMA_VERSIONS = ['bbs-v1']

// Migration seam for future breaking changes to the Project shape. Each key migrates
// FROM that schema version to the next one; parseProjectFromJSON walks the chain until
// it reaches SCHEMA_VERSION. Empty today — hook new migrations in here instead of
// patching field shapes ad hoc in parseProjectFromJSON.
type RawProject = Record<string, unknown>

const MIGRATIONS: Record<string, (data: RawProject) => RawProject> = {}

function migrateProject(data: RawProject, fromVersion: string): { data: RawProject; warning?: string } {
  let current = data
  let version = fromVersion
  const visited = new Set<string>()

  while (version !== SCHEMA_VERSION) {
    if (visited.has(version)) {
      return { data: current, warning: `Se detectó un ciclo de migración en el esquema "${version}".` }
    }
    visited.add(version)

    const step = MIGRATIONS[version]
    if (!step) {
      return {
        data: current,
        warning: KNOWN_SCHEMA_VERSIONS.includes(version)
          ? undefined
          : `Esquema de proyecto no reconocido ("${version}"). Se importó de todas formas — algunos campos podrían no mapearse correctamente.`,
      }
    }

    current = step(current)
    version = typeof current._schema === 'string' ? current._schema : SCHEMA_VERSION
  }

  return { data: current }
}

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

export function parseProjectFromJSON(jsonString: string, onWarning?: (message: string) => void): Project | null {
  try {
    const parsed = JSON.parse(jsonString)

    // Basic schema validation
    if (!parsed || typeof parsed !== 'object') return null
    if (!parsed.id || !parsed.title || !Array.isArray(parsed.sections)) return null

    const declaredVersion = typeof parsed._schema === 'string' ? parsed._schema : SCHEMA_VERSION
    const { data: migrated, warning } = migrateProject(parsed, declaredVersion)
    if (warning) onWarning?.(warning)

    // Strip meta key, sanitize, assign fresh ID to avoid collisions
    const projectData = { ...migrated }
    delete (projectData as { _schema?: string })._schema
    const imported = {
      ...projectData,
      id: `imported-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    } as unknown as Project

    return imported
  } catch {
    return null
  }
}
