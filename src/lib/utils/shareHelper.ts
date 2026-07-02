import type { Project } from '../types/project.types'

/**
 * Serializes a project to a compact base64 string for URL sharing.
 * Omit large base64 image strings to stay within standard URL size limits.
 */
export function compressAndEncodeProject(project: Project): string {
  // Deep clone to avoid mutating active project state
  const cleanProject = JSON.parse(JSON.stringify(project))

  cleanProject.sections = cleanProject.sections.map((sec: any) => {
    if (sec.data) {
      // Replace base64 images with premium Unsplash placeholder URLs for share links
      if (typeof sec.data.image === 'string' && sec.data.image.startsWith('data:')) {
        sec.data.image = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
      }
      if (Array.isArray(sec.data.mockups)) {
        sec.data.mockups = sec.data.mockups.map((mock: any) => {
          if (typeof mock.image === 'string' && mock.image.startsWith('data:')) {
            return {
              ...mock,
              image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
            }
          }
          return mock
        })
      }
    }
    return sec
  })

  try {
    const jsonStr = JSON.stringify(cleanProject)
    // UTF-8 base64 encoding helper
    return btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16))
    }))
  } catch (error) {
    console.error('Error compressing project for share link:', error)
    return ''
  }
}

/**
 * Deserializes a base64 project string from URL.
 */
export function decodeAndDecompressProject(payload: string): Project | null {
  try {
    const decodedStr = decodeURIComponent(atob(payload).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    
    const parsed = JSON.parse(decodedStr)
    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.sections)) {
      return parsed as Project
    }
    return null
  } catch (error) {
    console.error('Error decoding project payload:', error)
    return null
  }
}
