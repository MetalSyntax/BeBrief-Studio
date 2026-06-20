import React, { useState, useRef } from 'react'
import { Upload, X, Link, Clipboard } from 'lucide-react'

interface Props {
  value: string
  onChange: (value: string) => void
  label?: string
  className?: string
  withOcr?: boolean
  onOcrClick?: () => void
}

export function ImageUploader({ value, onChange, label, className = '', withOcr = false, onOcrClick }: Props) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [tempUrl, setTempUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      onChange(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

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
      handleFile(file)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const file = e.clipboardData.items[0]?.getAsFile()
    if (file && file.type.startsWith('image/')) {
      e.preventDefault()
      handleFile(file)
    }
  }

  const handlePasteFromClipboardButton = async () => {
    try {
      const items = await navigator.clipboard.read()
      for (const item of items) {
        const imageTypes = item.types.filter(t => t.startsWith('image/'))
        if (imageTypes.length > 0) {
          const blob = await item.getType(imageTypes[0])
          const file = new File([blob], 'clipboard-image.png', { type: imageTypes[0] })
          handleFile(file)
          break
        }
      }
    } catch (err) {
      console.warn('Failed to read clipboard directly, please use Cmd+V / Ctrl+V over the dropzone.', err)
    }
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tempUrl.trim()) {
      onChange(tempUrl.trim())
      setShowUrlInput(false)
      setTempUrl('')
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 block uppercase">
          {label}
        </span>
      )}

      {value ? (
        <div className="relative group border border-white/10 rounded-xl bg-zinc-900/50 p-2 overflow-hidden flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg border border-white/10 overflow-hidden bg-black flex items-center justify-center shrink-0">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
          
          <div className="flex-1 min-w-0">
            <span className="text-[11px] text-zinc-400 block truncate font-mono">
              {value.startsWith('data:') ? 'Imagen Base64' : value}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {withOcr && onOcrClick && (
              <button
                type="button"
                onClick={onOcrClick}
                className="px-2 py-1 rounded bg-violet-600/20 text-violet-400 hover:bg-violet-600 hover:text-white border border-violet-500/20 text-[10px] font-semibold transition-all shrink-0"
              >
                OCR
              </button>
            )}
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-500/20 border border-white/5 hover:border-red-500/20 text-zinc-400 hover:text-red-400 transition-all shrink-0"
              title="Eliminar Imagen"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {showUrlInput ? (
            <form onSubmit={handleUrlSubmit} className="flex gap-2">
              <input
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                className="flex-1 bg-zinc-900 border border-white/10 rounded-lg text-xs px-3 py-1.5 text-white focus:outline-none focus:border-violet-500"
                required
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-semibold text-white transition-colors"
              >
                OK
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(false)}
                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs border border-white/5 text-zinc-400"
              >
                <X size={12} />
              </button>
            </form>
          ) : (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onPaste={handlePaste}
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              className={`border border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-violet-500 bg-violet-500/5 text-violet-400'
                  : 'border-white/10 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-white/20 text-zinc-500 hover:text-zinc-400'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
              <Upload size={18} className="mb-1.5" />
              <p className="text-[10px] font-medium tracking-wide uppercase mb-1">
                Subir o soltar imagen
              </p>
              <p className="text-[9px] opacity-60 max-w-[200px]">
                Haz clic para examinar o pulsa Cmd+V aquí para pegar
              </p>
            </div>
          )}

          {!showUrlInput && (
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-[9px] font-semibold text-zinc-400 hover:text-white transition-all"
              >
                <Link size={10} />
                <span>Usar URL</span>
              </button>
              <button
                type="button"
                onClick={handlePasteFromClipboardButton}
                className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-[9px] font-semibold text-zinc-400 hover:text-white transition-all"
              >
                <Clipboard size={10} />
                <span>Pegar Portapapeles</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
