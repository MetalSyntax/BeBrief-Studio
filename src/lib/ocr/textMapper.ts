import type { OcrBlock } from './ocrEngine'

export interface FieldMappingSuggestion {
  blockIndex: number
  text: string
  suggestedField: string
  confidence: number // heuristic confidence (0-100)
}

/**
 * Heuristically suggests which form fields each OCR text block belongs to,
 * based on font height (bounding box) and string pattern matching.
 */
export function suggestFieldMappings(
  blocks: OcrBlock[],
  sectionType: string
): FieldMappingSuggestion[] {
  if (blocks.length === 0) return []

  // Estimate line height for each block to identify headings
  const blocksWithHeight = blocks.map((b, index) => {
    const lines = b.text.split('\n').filter(line => line.trim().length > 0)
    const lineCount = Math.max(1, lines.length)
    const blockHeight = b.bbox.y1 - b.bbox.y0
    const estimatedLineHeight = blockHeight / lineCount

    return {
      index,
      block: b,
      lines,
      estimatedLineHeight,
      wordCount: b.text.split(/\s+/).filter(Boolean).length,
      charCount: b.text.length
    }
  })

  // Sort blocks by estimated line height descending to find largest text
  const sortedByFontSize = [...blocksWithHeight].sort((a, b) => b.estimatedLineHeight - a.estimatedLineHeight)

  return blocksWithHeight.map(({ index, block, lines, wordCount, charCount }) => {
    const cleanText = block.text.trim()
    let suggestedField = 'none'
    let confidence = 10

    // Heuristics based on section type
    if (sectionType === 'cover') {
      // Largest text -> title
      if (sortedByFontSize[0]?.index === index) {
        suggestedField = 'title'
        confidence = 90
      } else if (sortedByFontSize[1]?.index === index && sortedByFontSize.length > 1) {
        suggestedField = 'subtitle'
        confidence = 80
      } else if (wordCount <= 4 && charCount < 30 && cleanText === cleanText.toUpperCase()) {
        suggestedField = 'eyebrow'
        confidence = 70
      } else if (wordCount <= 6 && charCount < 40) {
        suggestedField = 'subtitle'
        confidence = 40
      } else {
        suggestedField = 'subtitle'
        confidence = 20
      }
    } else if (sectionType === 'overview' || sectionType === 'results') {
      // Metrics value detection (starts with +, %, or is just numbers)
      const isMetricValue = /^[+-\u00B1]?\d+([\.,]\d+)?%?$/.test(cleanText) || cleanText.includes('%') || cleanText.startsWith('+')
      
      if (isMetricValue && wordCount <= 2) {
        suggestedField = 'metric.value'
        confidence = 85
      } else if (sortedByFontSize[0]?.index === index) {
        suggestedField = 'title'
        confidence = 90
      } else if (lines.length >= 2 || charCount > 60) {
        suggestedField = 'description' // (contextText for overview)
        confidence = 80
      } else if (wordCount <= 4 && charCount < 25) {
        suggestedField = 'metric.label'
        confidence = 60
      } else {
        suggestedField = 'description'
        confidence = 30
      }
    } else if (sectionType === 'problem' || sectionType === 'ux-flow' || sectionType === 'mockups') {
      if (sortedByFontSize[0]?.index === index) {
        suggestedField = 'title'
        confidence = 90
      } else if (lines.length >= 2 || charCount > 60) {
        suggestedField = 'description'
        confidence = 80
      } else if (wordCount <= 3 && charCount < 20) {
        suggestedField = 'sectionNumber'
        confidence = 50
      } else {
        suggestedField = 'description'
        confidence = 30
      }
    } else {
      // Fallback/generic mapping
      if (sortedByFontSize[0]?.index === index) {
        suggestedField = 'title'
        confidence = 80
      } else if (lines.length >= 2 || charCount > 60) {
        suggestedField = 'description'
        confidence = 70
      } else {
        suggestedField = 'description'
        confidence = 20
      }
    }

    return {
      blockIndex: index,
      text: block.text,
      suggestedField,
      confidence
    }
  })
}
