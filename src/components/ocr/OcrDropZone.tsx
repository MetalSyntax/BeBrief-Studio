import { useState, useRef } from 'react'
import { Upload, Clipboard, Link } from 'lucide-react'

interface Props {
  onImageSelected: (image: File | string) => void
}

export function OcrDropZone({ onImageSelected }: Props) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [url, setUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      onImageSelected(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageSelected(file)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const file = e.clipboardData.items[0]?.getAsFile()
    if (file && file.type.startsWith('image/')) {
      e.preventDefault()
      onImageSelected(file)
    }
  }

  const handleClipboardPasteClick = async () => {
    try {
      const items = await navigator.clipboard.read()
      for (const item of items) {
        const imageTypes = item.types.filter(t => t.startsWith('image/'))
        if (imageTypes.length > 0) {
          const blob = await item.getType(imageTypes[0])
          const file = new File([blob], 'ocr-clipboard-image.png', { type: imageTypes[0] })
          onImageSelected(file)
          break
        }
      }
    } catch (err) {
      console.warn('Clipboard direct read failed, use Cmd+V / Ctrl+V over the dropzone area.', err)
    }
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onImageSelected(url.trim())
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onPaste={handlePaste}
        onClick={() => fileInputRef.current?.click()}
        tabIndex={0}
        className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[220px] focus:outline-none ${
          isDragActive
            ? 'border-violet-500 bg-violet-500/5 text-violet-400'
            : 'border-white/10 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-violet-500/30 text-zinc-400'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Upload size={36} className="text-violet-400 mb-4 animate-pulse" />
        <h3 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">
          Arrastra tu Captura de Pantalla
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mb-3">
          Soporta arrastrar archivos de imagen, pegar con Cmd+V directamente sobre esta zona, o hacer clic para explorar.
        </p>
        <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-500 font-mono">
          FORMATOS: PNG, JPG, WEBP
        </span>
      </div>

      {showUrlInput ? (
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://ejemplo.com/screenshot.png"
            className="flex-1 bg-zinc-950 border border-white/10 rounded-lg text-xs px-3 py-2 text-white focus:outline-none focus:border-violet-500"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-semibold text-white transition-all shrink-0"
          >
            Analizar URL
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-xs text-zinc-400 border border-white/5"
          >
            Cancelar
          </button>
        </form>
      ) : (
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={handleClipboardPasteClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/5 hover:border-white/10 text-xs text-zinc-300 hover:text-white font-medium transition-all"
          >
            <Clipboard size={14} />
            <span>Pegar desde Clipboard</span>
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/5 hover:border-white/10 text-xs text-zinc-300 hover:text-white font-medium transition-all"
          >
            <Link size={14} />
            <span>Usar URL de Imagen</span>
          </button>
        </div>
      )}
    </div>
  )
}
