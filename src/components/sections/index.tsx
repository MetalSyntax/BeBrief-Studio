import React from 'react'
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
import { TestimonialSection } from './TestimonialSection'
import { TeamSection } from './TeamSection'
import { AwardsSection } from './AwardsSection'
import { TechStackSection } from './TechStackSection'
import { TimelineSection } from './TimelineSection'

interface SectionRendererProps {
  section: Section
  isEditing: boolean
  onClick?: (e?: any) => void
}

export function SectionRenderer({ section, isEditing, onClick }: SectionRendererProps) {
  if (!section.visible) return null

  const fontStyle: React.CSSProperties = section.style.displayFont && section.style.displayFont !== 'default'
    ? { '--font-display': `'${section.style.displayFont}', sans-serif` } as React.CSSProperties
    : {}

  let inner: React.ReactNode

  switch (section.type) {
    case 'cover':
      inner = <CoverSection section={section} isEditing={isEditing} onClick={onClick} />
      break
    case 'overview':
      inner = <OverviewSection section={section} isEditing={isEditing} onClick={onClick} />
      break
    case 'color-palette':
      inner = <ColorPaletteSection section={section} isEditing={isEditing} onClick={onClick} />
      break
    case 'mockups':
      inner = <MockupsSection section={section} isEditing={isEditing} onClick={onClick} />
      break
    case 'footer':
      inner = <FooterSection section={section} isEditing={isEditing} onClick={onClick} />
      break
    case 'problem':
      inner = <ProblemSection section={section} isEditing={isEditing} onClick={onClick} />
      break
    case 'process':
      inner = <ProcessSection section={section} isEditing={isEditing} onClick={onClick} />
      break
    case 'typography':
      inner = <TypographySection section={section} isEditing={isEditing} onClick={onClick} />
      break
    case 'ux-flow':
      inner = <UXFlowSection section={section} isEditing={isEditing} onClick={onClick} />
      break
    case 'results':
      inner = <ResultsSection section={section} isEditing={isEditing} onClick={onClick} />
      break
    case 'testimonial':
      inner = <TestimonialSection section={section} isEditing={isEditing} onClick={onClick} />
      break
    case 'team':
      inner = <TeamSection section={section} isEditing={isEditing} onClick={onClick} />
      break
    case 'awards':
      inner = <AwardsSection section={section} isEditing={isEditing} onClick={onClick} />
      break
    case 'tech-stack':
      inner = <TechStackSection section={section} isEditing={isEditing} onClick={onClick} />
      break
    case 'timeline':
      inner = <TimelineSection section={section} isEditing={isEditing} onClick={onClick} />
      break
    default:
      inner = (
        <div className="p-8 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-lg text-center">
          Componente de sección desconocido: {section.type}
        </div>
      )
  }

  if (Object.keys(fontStyle).length === 0) return <>{inner}</>

  return <div style={fontStyle}>{inner}</div>
}
