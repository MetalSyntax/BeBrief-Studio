import type { ComponentType } from 'react'
import {
  LayoutTemplate, BarChart3, AlertTriangle, GitBranch, Palette, Type,
  Image as ImageIcon, Waypoints, TrendingUp, UserSquare2,
  Quote, Users, Award, Wrench, Milestone,
} from 'lucide-react'
import type { SectionType, SectionStyle } from '../types/project.types'
import i18n from '../i18n'

export interface SectionManifestEntry {
  type: SectionType
  icon: ComponentType<{ size?: number; className?: string }>
  labelKey: string
  defaultData: () => Record<string, unknown>
  defaultStyle?: () => Partial<SectionStyle>
}

// Single source of truth for "add section" metadata — consumed by SectionList's
// add-menu and projectStore's addSection default data. Adding a new section type
// here is one of the steps in CLAUDE.md's "Adding a New Section" checklist.
export const SECTION_MANIFEST: SectionManifestEntry[] = [
  {
    type: 'cover',
    icon: LayoutTemplate,
    labelKey: 'sections.cover',
    defaultStyle: () => ({ background: 'var(--bg-section)' }),
    defaultData: () => ({
      eyebrow: i18n.t('defaults.cover.eyebrow', { defaultValue: 'UI/UX CASE STUDY' }),
      title: i18n.t('defaults.cover.title', { defaultValue: 'Nuevo Case Study' }),
      subtitle: i18n.t('defaults.cover.subtitle', { defaultValue: 'Descripción breve de este increíble proyecto.' }),
      titleSize: 'xl',
      layout: 'left',
      decorElements: false,
    }),
  },
  {
    type: 'overview',
    icon: BarChart3,
    labelKey: 'sections.overview',
    defaultData: () => ({
      sectionNumber: '01',
      title: i18n.t('defaults.overview.title', { defaultValue: 'Overview' }),
      contextText: i18n.t('defaults.overview.contextText', { defaultValue: 'Escribe aquí un resumen del proyecto, objetivos y contexto general.' }),
      metrics: [
        { label: i18n.t('defaults.overview.roleLabel', { defaultValue: 'Rol' }), value: i18n.t('defaults.overview.roleValue', { defaultValue: 'Diseñador' }) },
        { label: i18n.t('defaults.overview.durationLabel', { defaultValue: 'Duración' }), value: i18n.t('defaults.overview.durationValue', { defaultValue: '1 Mes' }) },
      ],
    }),
  },
  {
    type: 'problem',
    icon: AlertTriangle,
    labelKey: 'sections.problem',
    defaultData: () => ({
      sectionNumber: '02',
      title: i18n.t('defaults.problem.title', { defaultValue: 'El Problema' }),
      description: i18n.t('defaults.problem.description', { defaultValue: 'Explica los puntos de dolor detectados y qué intentas resolver.' }),
      image: '',
      layout: 'right-image',
    }),
  },
  {
    type: 'process',
    icon: GitBranch,
    labelKey: 'sections.process',
    defaultData: () => ({
      sectionNumber: '03',
      title: i18n.t('defaults.process.title', { defaultValue: 'El Proceso' }),
      steps: [
        { title: i18n.t('defaults.process.step1Title', { defaultValue: 'Investigación' }), description: i18n.t('defaults.process.step1Desc', { defaultValue: 'User interviews y benchmarking' }), icon: 'Search' },
        { title: i18n.t('defaults.process.step2Title', { defaultValue: 'Definición' }), description: i18n.t('defaults.process.step2Desc', { defaultValue: 'User personas e insights' }), icon: 'Target' },
        { title: i18n.t('defaults.process.step3Title', { defaultValue: 'Wireframes' }), description: i18n.t('defaults.process.step3Desc', { defaultValue: 'Estructuración y flujos' }), icon: 'Layers' },
      ],
    }),
  },
  {
    type: 'color-palette',
    icon: Palette,
    labelKey: 'sections.color-palette',
    defaultData: () => ({
      sectionNumber: '04',
      title: i18n.t('defaults.colorPalette.title', { defaultValue: 'Paleta de Colores' }),
      colors: [
        { name: i18n.t('defaults.colorPalette.color1Name', { defaultValue: 'Negro' }), hex: '#000000', role: i18n.t('defaults.colorPalette.color1Role', { defaultValue: 'Fondos y texto' }) },
        { name: i18n.t('defaults.colorPalette.color2Name', { defaultValue: 'Acento' }), hex: '#aa3bff', role: i18n.t('defaults.colorPalette.color2Role', { defaultValue: 'CTAs y foco' }) },
      ],
      layout: 'grid',
    }),
  },
  {
    type: 'typography',
    icon: Type,
    labelKey: 'sections.typography',
    defaultData: () => ({
      sectionNumber: '05',
      title: i18n.t('defaults.typography.title', { defaultValue: 'Tipografías' }),
      fonts: [
        { name: 'Inter', sample: 'Aa Bb Cc Dd Ee Ff 123', role: i18n.t('defaults.typography.fontRole', { defaultValue: 'Display y Cuerpo' }) },
      ],
    }),
  },
  {
    type: 'mockups',
    icon: ImageIcon,
    labelKey: 'sections.mockups',
    defaultData: () => ({
      sectionNumber: '06',
      title: i18n.t('defaults.mockups.title', { defaultValue: 'Visual Mockups' }),
      description: i18n.t('defaults.mockups.description', { defaultValue: 'Pantallas y componentes en alta definición.' }),
      mockups: [],
      layout: 'grid-2',
    }),
  },
  {
    type: 'ux-flow',
    icon: Waypoints,
    labelKey: 'sections.ux-flow',
    defaultData: () => ({
      sectionNumber: '07',
      title: i18n.t('defaults.uxFlow.title', { defaultValue: 'Flujo del Usuario' }),
      description: i18n.t('defaults.uxFlow.description', { defaultValue: 'Diagrama de interacciones principales.' }),
      image: '',
    }),
  },
  {
    type: 'results',
    icon: TrendingUp,
    labelKey: 'sections.results',
    defaultData: () => ({
      sectionNumber: '08',
      title: i18n.t('defaults.results.title', { defaultValue: 'Resultados y Métricas' }),
      description: i18n.t('defaults.results.description', { defaultValue: 'Cómo mejoró el producto tras la implementación.' }),
      metrics: [{ label: i18n.t('defaults.results.metricLabel', { defaultValue: 'Conversión' }), value: '+15%' }],
    }),
  },
  {
    type: 'testimonial',
    icon: Quote,
    labelKey: 'sections.testimonial',
    defaultData: () => ({
      sectionNumber: '09',
      quote: i18n.t('defaults.testimonial.quote', { defaultValue: 'Este equipo transformó por completo nuestra visión de producto en una experiencia real y medible.' }),
      authorName: i18n.t('defaults.testimonial.authorName', { defaultValue: 'Nombre del Cliente' }),
      authorRole: i18n.t('defaults.testimonial.authorRole', { defaultValue: 'CEO, Empresa' }),
      authorPhoto: '',
    }),
  },
  {
    type: 'team',
    icon: Users,
    labelKey: 'sections.team',
    defaultData: () => ({
      sectionNumber: '10',
      title: i18n.t('defaults.team.title', { defaultValue: 'El Equipo' }),
      members: [
        { name: i18n.t('defaults.team.member1Name', { defaultValue: 'Nombre Apellido' }), role: i18n.t('defaults.team.member1Role', { defaultValue: 'Product Designer' }), photo: '' },
        { name: i18n.t('defaults.team.member2Name', { defaultValue: 'Nombre Apellido' }), role: i18n.t('defaults.team.member2Role', { defaultValue: 'UX Researcher' }), photo: '' },
      ],
    }),
  },
  {
    type: 'awards',
    icon: Award,
    labelKey: 'sections.awards',
    defaultData: () => ({
      sectionNumber: '11',
      title: i18n.t('defaults.awards.title', { defaultValue: 'Reconocimientos' }),
      awards: [
        { title: i18n.t('defaults.awards.award1Title', { defaultValue: 'Site of the Day' }), issuer: i18n.t('defaults.awards.award1Issuer', { defaultValue: 'Awwwards' }), year: '2026' },
      ],
    }),
  },
  {
    type: 'tech-stack',
    icon: Wrench,
    labelKey: 'sections.tech-stack',
    defaultData: () => ({
      sectionNumber: '12',
      title: i18n.t('defaults.techStack.title', { defaultValue: 'Stack Tecnológico' }),
      items: [
        { name: 'Figma', category: i18n.t('defaults.techStack.categoryDesign', { defaultValue: 'Diseño' }) },
        { name: 'React', category: i18n.t('defaults.techStack.categoryDev', { defaultValue: 'Desarrollo' }) },
      ],
    }),
  },
  {
    type: 'timeline',
    icon: Milestone,
    labelKey: 'sections.timeline',
    defaultData: () => ({
      sectionNumber: '13',
      title: i18n.t('defaults.timeline.title', { defaultValue: 'Línea de Tiempo' }),
      milestones: [
        { date: i18n.t('defaults.timeline.milestone1Date', { defaultValue: 'Semana 1' }), title: i18n.t('defaults.timeline.milestone1Title', { defaultValue: 'Kickoff' }), description: i18n.t('defaults.timeline.milestone1Desc', { defaultValue: 'Alineación con stakeholders y research inicial.' }) },
        { date: i18n.t('defaults.timeline.milestone2Date', { defaultValue: 'Semana 4' }), title: i18n.t('defaults.timeline.milestone2Title', { defaultValue: 'Entrega Final' }), description: i18n.t('defaults.timeline.milestone2Desc', { defaultValue: 'Handoff a desarrollo y lanzamiento.' }) },
      ],
    }),
  },
  {
    type: 'footer',
    icon: UserSquare2,
    labelKey: 'sections.footer',
    defaultData: () => ({
      authorName: i18n.t('defaults.footer.authorName', { defaultValue: 'Tu Nombre' }),
      authorRole: i18n.t('defaults.footer.authorRole', { defaultValue: 'Diseñador UI/UX' }),
      year: new Date().getFullYear().toString(),
      socialLinks: [],
    }),
  },
]

export function getSectionManifestEntry(type: SectionType): SectionManifestEntry | undefined {
  return SECTION_MANIFEST.find((entry) => entry.type === type)
}
