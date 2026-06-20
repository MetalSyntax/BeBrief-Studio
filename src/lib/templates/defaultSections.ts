import type { Section } from '../types/project.types'

export const defaultSections: Section[] = [
  {
    id: 'cover-1',
    type: 'cover',
    order: 0,
    visible: true,
    data: {
      eyebrow: 'UI/UX CASE STUDY',
      title: 'E-commerce App\nRedesign',
      subtitle: 'Designing a premium retail experience focusing on micro-interactions and tactile visual design.',
      titleSize: 'display',
      layout: 'centered',
      decorElements: true,
      pageCounter: '01 / 05'
    },
    style: {
      background: 'var(--bg-section)',
      textColor: 'var(--text)',
      accentColor: 'var(--accent)',
      padding: '120px 40px',
      width: '1600px'
    }
  },
  {
    id: 'overview-1',
    type: 'overview',
    order: 1,
    visible: true,
    data: {
      sectionNumber: '01',
      title: 'Overview & Context',
      contextText: 'The project focuses on creating a seamless shopping experience for premium home decor. We aimed to reduce checkout friction, optimize mobile flows, and establish a high-end visual language that matches the physical products.',
      metrics: [
        { label: 'Role', value: 'Product Designer' },
        { label: 'Timeline', value: '12 Weeks' },
        { label: 'Client', value: 'Aura Home Co.' },
        { label: 'Conversion', value: '+24.5%' }
      ]
    },
    style: {
      background: 'var(--bg)',
      textColor: 'var(--text)',
      accentColor: 'var(--accent)',
      padding: '100px 80px',
      width: '1600px'
    }
  },
  {
    id: 'palette-1',
    type: 'color-palette',
    order: 2,
    visible: true,
    data: {
      sectionNumber: '02',
      title: 'Brand Identity & Colors',
      colors: [
        { name: 'Pure Charcoal', hex: '#0E0B09', role: 'Primary background' },
        { name: 'Warm Terracotta', hex: '#D97757', role: 'Accent highlights' },
        { name: 'Vintage Cream', hex: '#F8F4E9', role: 'Primary text & surfaces' },
        { name: 'Muted Taupe', hex: '#C2B4A4', role: 'Supporting text' }
      ],
      layout: 'grid'
    },
    style: {
      background: 'var(--bg-section)',
      textColor: 'var(--text)',
      accentColor: 'var(--accent)',
      padding: '100px 80px',
      width: '1600px'
    }
  },
  {
    id: 'mockups-1',
    type: 'mockups',
    order: 3,
    visible: true,
    data: {
      sectionNumber: '03',
      title: 'Visual Showcase',
      description: 'Explore the high-fidelity designs of the application, featuring refined grids and content hierarchies.',
      mockups: [
        { image: '', alt: 'Home Dashboard screen', deviceFrame: 'phone' },
        { image: '', alt: 'Product Detail screen', deviceFrame: 'phone' },
        { image: '', alt: 'Checkout Flow screen', deviceFrame: 'phone' },
        { image: '', alt: 'Cart Drawer', deviceFrame: 'phone' }
      ],
      layout: 'grid-2'
    },
    style: {
      background: 'var(--bg)',
      textColor: 'var(--text)',
      accentColor: 'var(--accent)',
      padding: '100px 80px',
      width: '1600px'
    }
  },
  {
    id: 'footer-1',
    type: 'footer',
    order: 4,
    visible: true,
    data: {
      authorName: 'Creative Designer',
      authorRole: 'UI/UX & Product Design',
      year: '2026',
      socialLinks: [
        { platform: 'Behance', url: 'https://behance.net' },
        { platform: 'Dribbble', url: 'https://dribbble.com' },
        { platform: 'LinkedIn', url: 'https://linkedin.com' }
      ]
    },
    style: {
      background: 'var(--bg-section)',
      textColor: 'var(--text)',
      accentColor: 'var(--accent)',
      padding: '80px 40px',
      width: '1600px'
    }
  }
]
