import { useRef, useState, useEffect } from 'react'
import { useProjectStore } from '../../lib/store/projectStore'
import { SectionRenderer } from '../sections'
import { ZoomIn, ZoomOut, GripVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableCanvasSection({ 
  sec, 
  activeSectionId, 
  previewMode, 
  setActiveSectionId 
}: { 
  sec: any
  activeSectionId: string | null
  previewMode: boolean
  setActiveSectionId: (id: string | null) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: sec.id, disabled: previewMode })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : 'auto',
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="relative group/canvas-sec"
    >
      <SectionRenderer
        section={sec}
        isEditing={!previewMode && activeSectionId === sec.id}
        onClick={(e?: any) => {
          if (!previewMode) {
            e?.stopPropagation()
            setActiveSectionId(sec.id)
          }
        }}
      />
      {!previewMode && (
        <div 
          {...attributes} 
          {...listeners}
          className="absolute top-2 left-2 z-40 bg-zinc-950/90 border border-white/10 hover:border-violet-500/50 hover:bg-violet-600 px-2 py-1 rounded-lg text-zinc-400 hover:text-white cursor-grab active:cursor-grabbing opacity-0 group-hover/canvas-sec:opacity-100 transition-all shadow-xl flex items-center gap-1.5 text-[10px] font-semibold select-none"
          title="Arrastrar para reordenar"
        >
          <GripVertical size={12} />
          <span>Mover</span>
        </div>
      )}
    </div>
  )
}

export function EditorCanvas() {
  const { project, activeSectionId, setActiveSectionId, previewMode, reorderSections } = useProjectStore()
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  
  const [zoomMode, setZoomMode] = useState<'auto' | 'custom'>('auto')
  const [zoomScale, setZoomScale] = useState(1)
  const [canvasHeight, setCanvasHeight] = useState<number>(0)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = project.sections.findIndex((s) => s.id === active.id)
      const newIndex = project.sections.findIndex((s) => s.id === over.id)
      const newSections = arrayMove(project.sections, oldIndex, newIndex)
      reorderSections(newSections)
    }
  }

  // Track window resize to reactively switch mobile/desktop styles
  useEffect(() => {
    const handleWinResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleWinResize)
    return () => window.removeEventListener('resize', handleWinResize)
  }, [])

  const isMobileView = windowWidth < 768

  // Auto-scale handler
  useEffect(() => {
    if (zoomMode !== 'auto') return

    const handleResize = () => {
      if (!containerRef.current) return
      const isMobile = window.innerWidth < 768
      const parentWidth = containerRef.current.clientWidth - (isMobile ? 24 : 48)
      const targetWidth = isMobile ? 498 : 1600

      // Scale to fit on both mobile and any desktop narrower than 1600px
      setZoomScale(Math.min(1, parentWidth / targetWidth))
    }

    handleResize()
    
    const observer = new ResizeObserver(handleResize)
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [zoomMode, project.sections.length, previewMode, windowWidth])

  // Canvas height observer
  useEffect(() => {
    if (!canvasRef.current) return

    const handleCanvasResize = () => {
      if (canvasRef.current) {
        setCanvasHeight(canvasRef.current.offsetHeight)
      }
    }

    handleCanvasResize()

    const observer = new ResizeObserver(handleCanvasResize)
    observer.observe(canvasRef.current)

    return () => {
      observer.disconnect()
    }
  }, [project.sections])

  const [touchStartDist, setTouchStartDist] = useState<number | null>(null)
  const [initialScale, setInitialScale] = useState<number>(1)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      setTouchStartDist(dist)
      setInitialScale(zoomScale)
      setZoomMode('custom')
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDist !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      const factor = dist / touchStartDist
      const newScale = Math.min(1.5, Math.max(0.2, initialScale * factor))
      setZoomScale(newScale)
    }
  }

  const handleTouchEnd = () => {
    setTouchStartDist(null)
  }

  const sortedSections = [...project.sections].sort((a, b) => a.order - b.order)

  return (
    <div className="flex-1 bg-[#1e1e24] overflow-hidden flex flex-col relative h-full">
      {!previewMode && (
        <div className="absolute bottom-4 right-4 bg-zinc-950/80 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-3 z-30 backdrop-blur-md shadow-2xl">
          <button 
            onClick={() => {
              setZoomMode('custom')
              setZoomScale(prev => Math.max(0.2, prev - 0.1))
            }}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
            title="Alejar Zoom"
          >
            <ZoomOut size={14} />
          </button>
          
          <span className="font-mono text-xs text-white min-w-10 text-center select-none font-semibold">
            {Math.round(zoomScale * 100)}%
          </span>
          
          <button 
            onClick={() => {
              setZoomMode('custom')
              setZoomScale(prev => Math.min(1.5, prev + 0.1))
            }}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
            title="Acercar Zoom"
          >
            <ZoomIn size={14} />
          </button>

          <div className="w-px h-3 bg-white/10" />

          <button
            onClick={() => setZoomMode('auto')}
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded transition-all ${
              zoomMode === 'auto'
                ? 'bg-violet-600 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {t('canvas.zoomFit')}
          </button>
        </div>
      )}

      {/* Outer Scroll Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-3 lg:p-6 flex items-start custom-scrollbar"
        onClick={() => !previewMode && setActiveSectionId(null)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Dynamic size wrapper to preserve scaled dimensions in browser layout */}
        <div
          style={{
            width: `${(isMobileView ? 498 : 1600) * zoomScale}px`,
            height: canvasHeight ? `${canvasHeight * zoomScale}px` : 'auto',
            transition: 'width 150ms ease-out, height 150ms ease-out',
          }}
          className="shrink-0 flex justify-start items-start overflow-hidden rounded-2xl mx-auto"
        >
          {/* Scaled Inner Canvas */}
          <div
            ref={canvasRef}
            id="brief-canvas-export"
            style={{
              width: `${isMobileView ? 498 : 1600}px`,
              transform: `scale(${zoomScale})`,
              transformOrigin: 'top left',
              transition: 'transform 150ms ease-out',
            }}
            className="shadow-2xl border border-white/5 rounded-2xl overflow-hidden shrink-0 flex flex-col bg-[#13131a]"
          >
            {sortedSections.length === 0 ? (
              <div className="bg-[#13131a] p-24 text-center border border-white/5 rounded-2xl text-zinc-400">
                <p className="text-lg font-semibold mb-2">{t('canvas.emptyTitle')}</p>
                <p className="text-sm opacity-60">{t('canvas.emptyDesc')}</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sortedSections.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {sortedSections.map((sec) => (
                    <SortableCanvasSection
                      key={sec.id}
                      sec={sec}
                      activeSectionId={activeSectionId}
                      previewMode={previewMode}
                      setActiveSectionId={setActiveSectionId}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
