export interface OcrBlock {
  text: string
  confidence: number // 0–100
  bbox: { x0: number; y0: number; x1: number; y1: number }
}

export async function extractTextFromImage(
  imageSource: File | string,
  onProgress: (pct: number) => void
): Promise<OcrBlock[]> {
  const { createWorker } = await import('tesseract.js')
  
  const worker = await (createWorker as any)({
    logger: (m: any) => {
      if (m.status === 'recognizing text') {
        onProgress(Math.round(m.progress * 100))
      } else {
        // Map other phases to some low initial progress
        onProgress(5)
      }
    }
  })

  try {
    const langs = 'spa+eng+por'
    // Tesseract.js v5+ has createWorker handle language loading internally or via loadLanguage.
    // To ensure compatibility with v4 and v5:
    if (typeof (worker as any).loadLanguage === 'function') {
      await (worker as any).loadLanguage(langs)
      if (typeof (worker as any).initialize === 'function') {
        await (worker as any).initialize(langs)
      }
    }

    const imagePath = typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource)
    
    // Perform recognition
    const { data } = await worker.recognize(imagePath)
    const page = data as any

    if (typeof imageSource !== 'string') {
      URL.revokeObjectURL(imagePath)
    }

    // Terminate worker to free memory
    await worker.terminate()

    // Extract blocks
    const blocks: OcrBlock[] = []
    
    if (page && page.paragraphs) {
      page.paragraphs.forEach((p: any) => {
        if (p.text && p.text.trim()) {
          blocks.push({
            text: p.text.trim(),
            confidence: p.confidence || 0,
            bbox: p.bbox || { x0: 0, y0: 0, x1: 0, y1: 0 }
          })
        }
      });
    }

    // Fallback if paragraphs are empty but lines or text exist
    if (blocks.length === 0 && page && page.lines) {
      page.lines.forEach((l: any) => {
        if (l.text && l.text.trim()) {
          blocks.push({
            text: l.text.trim(),
            confidence: l.confidence || 0,
            bbox: l.bbox || { x0: 0, y0: 0, x1: 0, y1: 0 }
          })
        }
      });
    }

    if (blocks.length === 0 && page && page.text && page.text.trim()) {
      blocks.push({
        text: page.text.trim(),
        confidence: 70,
        bbox: { x0: 0, y0: 0, x1: 100, y1: 100 }
      })
    }

    return blocks
  } catch (error) {
    console.error('OCR Extraction error:', error)
    try {
      await worker.terminate()
    } catch {}
    throw error
  }
}
