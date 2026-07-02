import type { Project } from '../types/project.types'

export interface CommunityTemplate {
  id: string
  title: string
  creator: string
  description: string
  themeColor: string
  badge: string
  project: Project
}

export const communityTemplates: CommunityTemplate[] = [
  {
    id: 'ct-aura-branding',
    title: 'Aura Minimalist Portfolio',
    creator: 'Aura Design Co.',
    description: 'Estudio de caso para identidad de marca editorial y minimalista, con composiciones limpias y contrastes tipográficos finos.',
    themeColor: 'bg-[#1a1410] border-[#C9A988]/30',
    badge: 'Branding',
    project: {
      id: 'aura-portfolio',
      title: 'Aura Minimalist Portfolio',
      theme: 'dark-editorial',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [
        {
          id: 'aura-sec-1',
          type: 'cover',
          order: 0,
          visible: true,
          style: {
            background: 'var(--bg-section)',
            textColor: 'var(--text)',
            accentColor: '#C9A988',
            titleSize: 'display',
            hideTitle: false,
            hideSubtitle: false,
            hideEyebrow: false,
            hidePageCounter: false
          },
          data: {
            eyebrow: 'ESTUDIO DE CASO DE IDENTIDAD',
            title: 'Aura\nCo.',
            subtitle: 'Rediseño de marca de lujo consciente y dirección de arte.',
            pageCounter: '01 / 05',
            decorElements: true,
            decorType: 'glow'
          }
        },
        {
          id: 'aura-sec-2',
          type: 'overview',
          order: 1,
          visible: true,
          style: {
            background: 'var(--bg-section)',
            textColor: 'var(--text)',
            accentColor: '#C9A988',
            hideSectionNumber: false,
            hideTitle: false,
            hideDescription: false
          },
          data: {
            sectionNumber: '01',
            title: 'Contexto del Proyecto',
            contextText: 'Aura Co. es una boutique de bienestar sostenible que requería una identidad visual que reflejara serenidad y lujo orgánico.\n\nDesarrollamos una dirección de arte enfocada en la tipografía serif elegante y la amplitud visual para captar un público Premium.',
            metrics: [
              { label: 'Aumento de Engangement', value: '+45%' },
              { label: 'Reconocimiento de Marca', value: '88%' }
            ]
          }
        },
        {
          id: 'aura-sec-3',
          type: 'color-palette',
          order: 2,
          visible: true,
          style: {
            background: 'var(--bg-section)',
            textColor: 'var(--text)',
            accentColor: '#C9A988',
            hideSectionNumber: false,
            hideTitle: false
          },
          data: {
            sectionNumber: '02',
            title: 'Sistema Cromático',
            layout: 'grid',
            colors: [
              { name: 'Oatmeal', hex: '#EAE5DB', role: 'Primario (Fondo)' },
              { name: 'Warm Charcoal', hex: '#1C1A17', role: 'Secundario (Texto)' },
              { name: 'Dusty Clay', hex: '#C9A988', role: 'Acento' },
              { name: 'Soft Sage', hex: '#A8B0A0', role: 'Terciario' }
            ]
          }
        },
        {
          id: 'aura-sec-4',
          type: 'typography',
          order: 3,
          visible: true,
          style: {
            background: 'var(--bg)',
            textColor: 'var(--text)',
            accentColor: '#C9A988',
            hideSectionNumber: false,
            hideTitle: false
          },
          data: {
            sectionNumber: '03',
            title: 'Sistema Tipográfico',
            fonts: [
              { name: 'Playfair Display', sample: 'Aura Wellness Co.', role: 'Display / Titulares' },
              { name: 'Manrope', sample: 'Serenidad y lujo orgánico', role: 'Cuerpo de texto' }
            ]
          }
        },
        {
          id: 'aura-sec-5',
          type: 'results',
          order: 4,
          visible: true,
          style: {
            background: 'var(--bg-section)',
            textColor: 'var(--text)',
            accentColor: '#C9A988',
            hideSectionNumber: false,
            hideTitle: false,
            hideDescription: false
          },
          data: {
            sectionNumber: '04',
            title: 'Resultados de la Campaña',
            description: 'El relanzamiento de marca consolidó a Aura Co. como referente boutique dentro de su categoría en menos de un trimestre.',
            metrics: [
              { label: 'Retención de Clientes', value: '+32%' },
              { label: 'Menciones en Prensa', value: '18' }
            ]
          }
        },
        {
          id: 'aura-sec-6',
          type: 'footer',
          order: 5,
          visible: true,
          style: {
            background: 'var(--bg-section)',
            textColor: 'var(--text)',
            accentColor: '#C9A988'
          },
          data: {
            authorName: 'Aura Design Co.',
            authorRole: 'Brand & Art Direction',
            year: '2026',
            socialLinks: [{ platform: 'Behance', url: 'https://behance.net' }]
          }
        }
      ]
    }
  },
  {
    id: 'ct-cyber-dashboard',
    title: 'Cyberpunk Crypto Wallet',
    creator: 'NeonSyntax',
    description: 'Brief interactivo de alta fidelidad para plataformas criptográficas modernas, con rejillas retro y resplandores neón.',
    themeColor: 'bg-[#030303] border-cyan-400/35 text-cyan-400',
    badge: 'UI/UX',
    project: {
      id: 'cyber-dashboard',
      title: 'Cyberpunk Crypto Wallet',
      theme: 'cyberpunk',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [
        {
          id: 'cyber-sec-1',
          type: 'cover',
          order: 0,
          visible: true,
          style: {
            background: 'var(--bg-section)',
            textColor: 'var(--text)',
            accentColor: '#00f0ff',
            titleSize: 'display',
            hideTitle: false,
            hideSubtitle: false,
            hideEyebrow: false,
            hidePageCounter: false
          },
          data: {
            eyebrow: 'DEFI WALLET PORTFOLIO',
            title: 'NEXUS\nSYSTEM',
            subtitle: 'La siguiente evolución en finanzas descentralizadas.',
            pageCounter: 'SYSTEM V2.0',
            decorElements: true,
            decorType: 'grid'
          }
        },
        {
          id: 'cyber-sec-2',
          type: 'mockups',
          order: 1,
          visible: true,
          style: {
            background: 'var(--bg-section)',
            textColor: 'var(--text)',
            accentColor: '#00f0ff',
            hideSectionNumber: false,
            hideTitle: false,
            hideDescription: false
          },
          data: {
            sectionNumber: '03',
            title: 'Interfaz del Dashboard',
            description: 'Vista del panel principal en su versión web horizontal, optimizada para analíticas rápidas de criptoactivos.',
            layout: 'grid-2',
            mockups: [
              { image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', alt: 'Panel Principal', deviceFrame: 'browser', caption: 'Vista del Dashboard en navegador de escritorio.' }
            ]
          }
        },
        {
          id: 'cyber-sec-3',
          type: 'overview',
          order: 2,
          visible: true,
          style: {
            background: 'var(--bg)',
            textColor: 'var(--text)',
            accentColor: '#00f0ff',
            hideSectionNumber: false,
            hideTitle: false,
            hideDescription: false
          },
          data: {
            sectionNumber: '01',
            title: 'Contexto del Producto',
            contextText: 'NEXUS es una wallet no custodial para DeFi multi-chain. El reto fue simplificar operaciones complejas (staking, swaps, bridges) sin sacrificar la estética cyberpunk que la marca exige.',
            metrics: [
              { label: 'Rol', value: 'Lead Product Designer' },
              { label: 'Duración', value: '10 Semanas' }
            ]
          }
        },
        {
          id: 'cyber-sec-4',
          type: 'process',
          order: 3,
          visible: true,
          style: {
            background: 'var(--bg-section)',
            textColor: 'var(--text)',
            accentColor: '#00f0ff',
            hideSectionNumber: false,
            hideTitle: false
          },
          data: {
            sectionNumber: '02',
            title: 'Proceso de Diseño',
            steps: [
              { title: 'Auditoría', description: 'Benchmark de 12 wallets DeFi líderes del mercado.', icon: 'Search' },
              { title: 'Sistema UI', description: 'Design tokens neón sobre grid modular de 8px.', icon: 'Layers' },
              { title: 'Prototipo', description: 'Flujos de staking y swap validados con 20 usuarios.', icon: 'Zap' }
            ]
          }
        },
        {
          id: 'cyber-sec-5',
          type: 'results',
          order: 4,
          visible: true,
          style: {
            background: 'var(--bg)',
            textColor: 'var(--text)',
            accentColor: '#00f0ff',
            hideSectionNumber: false,
            hideTitle: false,
            hideDescription: false
          },
          data: {
            sectionNumber: '04',
            title: 'Impacto Post-Lanzamiento',
            description: 'El rediseño redujo la fricción en operaciones multi-chain y mejoró la retención semanal de la wallet.',
            metrics: [
              { label: 'Tiempo de Transacción', value: '-38%' },
              { label: 'Retención Semanal', value: '+52%' }
            ]
          }
        },
        {
          id: 'cyber-sec-6',
          type: 'footer',
          order: 5,
          visible: true,
          style: {
            background: 'var(--bg-section)',
            textColor: 'var(--text)',
            accentColor: '#00f0ff'
          },
          data: {
            authorName: 'NeonSyntax',
            authorRole: 'Product & UI Design',
            year: '2026',
            socialLinks: [{ platform: 'Dribbble', url: 'https://dribbble.com' }]
          }
        }
      ]
    }
  },
  {
    id: 'ct-nordic-app',
    title: 'Nordic Forest Application',
    creator: 'Svehn Larsson',
    description: 'Estudio de caso para una aplicación móvil ambiental, construida sobre minimalismo sueco y contrastes de grises.',
    themeColor: 'bg-[#eef2f6] border-slate-300 text-slate-800',
    badge: 'Mobile App',
    project: {
      id: 'nordic-forest',
      title: 'Nordic Forest Application',
      theme: 'nordic-light',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [
        {
          id: 'nordic-sec-1',
          type: 'cover',
          order: 0,
          visible: true,
          style: {
            background: 'var(--bg-section)',
            textColor: 'var(--text)',
            accentColor: '#4f5e71',
            titleSize: 'xl',
            hideTitle: false,
            hideSubtitle: false,
            hideEyebrow: false,
            hidePageCounter: false
          },
          data: {
            eyebrow: 'MOBILE APP PRESENTATION',
            title: 'Skog.',
            subtitle: 'Conectando comunidades urbanas con la naturaleza.',
            pageCounter: '01',
            decorElements: true,
            decorType: 'crosses'
          }
        },
        {
          id: 'nordic-sec-2',
          type: 'process',
          order: 1,
          visible: true,
          style: {
            background: 'var(--bg-section)',
            textColor: 'var(--text)',
            accentColor: '#4f5e71',
            hideSectionNumber: false,
            hideTitle: false
          },
          data: {
            sectionNumber: '02',
            title: 'Metodología',
            steps: [
              { title: 'Investigación', description: 'Auditorías de campo y entrevistas en parques urbanos de Estocolmo.', icon: 'Search' },
              { title: 'Diseño UX', description: 'Wireframes iterativos enfocados en la rapidez y minimalismo de gestos.', icon: 'Layout' }
            ]
          }
        },
        {
          id: 'nordic-sec-3',
          type: 'overview',
          order: 2,
          visible: true,
          style: {
            background: 'var(--bg)',
            textColor: 'var(--text)',
            accentColor: '#4f5e71',
            hideSectionNumber: false,
            hideTitle: false,
            hideDescription: false
          },
          data: {
            sectionNumber: '01',
            title: 'Contexto del Proyecto',
            contextText: 'Skog conecta a comunidades urbanas escandinavas con espacios verdes cercanos, promoviendo caminatas guiadas y voluntariado ambiental de bajo compromiso.',
            metrics: [
              { label: 'Rol', value: 'UX/UI Designer' },
              { label: 'Duración', value: '6 Semanas' }
            ]
          }
        },
        {
          id: 'nordic-sec-4',
          type: 'color-palette',
          order: 3,
          visible: true,
          style: {
            background: 'var(--bg-section)',
            textColor: 'var(--text)',
            accentColor: '#4f5e71',
            hideSectionNumber: false,
            hideTitle: false
          },
          data: {
            sectionNumber: '03',
            title: 'Paleta Escandinava',
            layout: 'grid',
            colors: [
              { name: 'Nordic Fog', hex: '#eceff4', role: 'Fondo primario' },
              { name: 'Slate Pine', hex: '#4f5e71', role: 'Acento y CTAs' },
              { name: 'Deep Forest', hex: '#2e3440', role: 'Texto principal' },
              { name: 'Lichen Grey', hex: '#d8dee9', role: 'Bordes y divisores' }
            ]
          }
        },
        {
          id: 'nordic-sec-5',
          type: 'results',
          order: 4,
          visible: true,
          style: {
            background: 'var(--bg)',
            textColor: 'var(--text)',
            accentColor: '#4f5e71',
            hideSectionNumber: false,
            hideTitle: false,
            hideDescription: false
          },
          data: {
            sectionNumber: '04',
            title: 'Resultados del Piloto',
            description: 'El piloto en Estocolmo validó el modelo de caminatas guiadas como principal motor de retención de la app.',
            metrics: [
              { label: 'Usuarios Activos', value: '2,400' },
              { label: 'Caminatas Completadas', value: '890' }
            ]
          }
        },
        {
          id: 'nordic-sec-6',
          type: 'footer',
          order: 5,
          visible: true,
          style: {
            background: 'var(--bg-section)',
            textColor: 'var(--text)',
            accentColor: '#4f5e71'
          },
          data: {
            authorName: 'Svehn Larsson',
            authorRole: 'Product Designer',
            year: '2026',
            socialLinks: [{ platform: 'Behance', url: 'https://behance.net' }]
          }
        }
      ]
    }
  }
]
