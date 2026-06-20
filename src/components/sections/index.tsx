import type { Section } from '../../lib/types/project.types'
import { CoverSection } from './CoverSection'
import { OverviewSection } from './OverviewSection'
import { ColorPaletteSection } from './ColorPaletteSection'
import { MockupsSection } from './MockupsSection'
import { FooterSection } from './FooterSection'
import { ProblemSection } from './ProblemSection'
import { ProcessSection } from './ProcessSection'
import { TypographySection } from './TypographySection'
import { UXFlowSection } from './UXFlowSection'
import { ResultsSection } from './ResultsSection'

interface SectionRendererProps {
  section: Section
  isEditing: boolean
  onClick?: () => void
}

export function SectionRenderer({ section, isEditing, onClick }: SectionRendererProps) {
  if (!section.visible) return null

  switch (section.type) {
    case 'cover':
      return <CoverSection section={section} isEditing={isEditing} onClick={onClick} />
    case 'overview':
      return <OverviewSection section={section} isEditing={isEditing} onClick={onClick} />
    case 'color-palette':
      return <ColorPaletteSection section={section} isEditing={isEditing} onClick={onClick} />
    case 'mockups':
      return <MockupsSection section={section} isEditing={isEditing} onClick={onClick} />
    case 'footer':
      return <FooterSection section={section} isEditing={isEditing} onClick={onClick} />
    case 'problem':
      return <ProblemSection section={section} isEditing={isEditing} onClick={onClick} />
    case 'process':
      return <ProcessSection section={section} isEditing={isEditing} onClick={onClick} />
    case 'typography':
      return <TypographySection section={section} isEditing={isEditing} onClick={onClick} />
    case 'ux-flow':
      return <UXFlowSection section={section} isEditing={isEditing} onClick={onClick} />
    case 'results':
      return <ResultsSection section={section} isEditing={isEditing} onClick={onClick} />
    default:
      return (
        <div className="p-8 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-lg text-center">
          Componente de sección desconocido: {section.type}
        </div>
      )
  }
}
