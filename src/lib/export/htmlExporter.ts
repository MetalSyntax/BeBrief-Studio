import type { Project } from '../types/project.types'
import { themes } from '../themes'

export function exportProjectToHTML(project: Project): string {
  const activeTheme = themes[project.theme]
  
  // Build variables string
  const cssVariables = Object.entries(activeTheme)
    .map(([key, val]) => `    ${key}: ${val};`)
    .join('\n')

  // Generate Font imports based on theme
  const fontLink = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:wght@100..900&family=Manrope:wght@200..800&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Sora:wght@100..800&family=Space+Grotesk:wght@300..700&display=swap');`

  // Build HTML sections string
  const sortedSections = [...project.sections]
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order)

  const renderedSections = sortedSections.map((section) => {
    const { type, data, style } = section
    const secStyleAttr = `style="background: ${style.background}; color: ${style.textColor}; padding: ${style.padding || '100px 80px'}; width: ${style.width || '1600px'};"`

    switch (type) {
      case 'cover':
        return `
        <div class="section-container" ${secStyleAttr}>
          ${data.decorElements ? '<div class="decor-blob"></div>' : ''}
          <div class="section-content ${data.layout === 'centered' ? 'text-center items-center' : 'text-left items-start'}">
            ${data.pageCounter ? `<div class="page-counter">${data.pageCounter}</div>` : ''}
            <span class="eyebrow">${data.eyebrow}</span>
            <h1 class="title font-display ${data.titleSize === 'display' ? 'text-xl' : data.titleSize === 'xxl' ? 'text-lg' : 'text-md'}">${data.title.replace(/\n/g, '<br>')}</h1>
            <p class="subtitle font-body">${data.subtitle}</p>
          </div>
        </div>`
        
      case 'overview':
        return `
        <div class="section-container" ${secStyleAttr}>
          <div class="section-content-grid grid-12">
            <div class="col-8">
              <div class="section-header">
                ${data.sectionNumber ? `<span class="section-number">${data.sectionNumber}</span>` : ''}
                <h2 class="section-title font-display">${data.title}</h2>
              </div>
              <p class="overview-text font-body">${data.contextText}</p>
            </div>
            <div class="col-4 metrics-grid">
              ${(data.metrics || []).map((m: any) => `
                <div class="metric-card">
                  <div class="metric-label">${m.label}</div>
                  <div class="metric-value font-mono">${m.value}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>`
        
      case 'color-palette':
        return `
        <div class="section-container" ${secStyleAttr}>
          <div class="section-content">
            <div class="section-header">
              ${data.sectionNumber ? `<span class="section-number">${data.sectionNumber}</span>` : ''}
              <h2 class="section-title font-display">${data.title}</h2>
            </div>
            <div class="colors-${data.layout === 'horizontal-strip' ? 'strip' : 'grid'}">
              ${(data.colors || []).map((c: any) => `
                <div class="color-card">
                  <div class="color-swatch" style="background-color: ${c.hex};"></div>
                  <div class="color-name">${c.name}</div>
                  <div class="color-hex font-mono">${c.hex}</div>
                  <div class="color-role">${c.role}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>`
        
      case 'mockups':
        const gridClass = data.layout === 'grid-3' ? 'grid-3' : data.layout === 'centered-large' ? 'centered-large' : data.layout === 'scattered' ? 'scattered' : 'grid-2'
        return `
        <div class="section-container" ${secStyleAttr}>
          <div class="section-content">
            <div class="section-header">
              ${data.sectionNumber ? `<span class="section-number">${data.sectionNumber}</span>` : ''}
              <h2 class="section-title font-display">${data.title}</h2>
            </div>
            ${data.description ? `<p class="section-desc font-body">${data.description}</p>` : ''}
            <div class="mockups-container ${gridClass}">
              ${(data.mockups || []).map((mock: any, idx: number) => `
                <div class="mockup-item device-${mock.deviceFrame}">
                  ${mock.image 
                    ? `<img src="${mock.image}" alt="${mock.alt || ''}">` 
                    : `
                    <div class="mockup-placeholder">
                      <div class="device-frame-outline"></div>
                      <span>${mock.alt || `Mockup ${idx + 1}`}</span>
                    </div>`
                  }
                </div>
              `).join('')}
            </div>
          </div>
        </div>`
        
      case 'footer':
        return `
        <div class="section-container" ${secStyleAttr}>
          <div class="footer-content">
            <div>
              <h3 class="footer-author font-display">${data.authorName}</h3>
              <p class="footer-meta font-body">${data.authorRole} &middot; ${data.year}</p>
            </div>
            <div class="footer-links">
              ${(data.socialLinks || []).map((l: any) => `
                <a href="${l.url}" class="footer-link font-mono">${l.platform}</a>
              `).join('')}
            </div>
          </div>
        </div>`

      case 'problem':
        return `
        <div class="section-container" ${secStyleAttr}>
          <div class="section-content-grid grid-2-col ${data.layout === 'left-image' ? 'reverse' : ''}">
            <div>
              <div class="section-header">
                ${data.sectionNumber ? `<span class="section-number">${data.sectionNumber}</span>` : ''}
                <h2 class="section-title font-display">${data.title}</h2>
              </div>
              <p class="body-text font-body">${data.description}</p>
            </div>
            <div class="image-wrapper">
              ${data.image ? `<img src="${data.image}">` : '<div class="img-placeholder">Problem Image</div>'}
            </div>
          </div>
        </div>`

      case 'process':
        return `
        <div class="section-container" ${secStyleAttr}>
          <div class="section-content">
            <div class="section-header">
              ${data.sectionNumber ? `<span class="section-number">${data.sectionNumber}</span>` : ''}
              <h2 class="section-title font-display">${data.title}</h2>
            </div>
            <div class="steps-grid">
              ${(data.steps || []).map((step: any, idx: number) => `
                <div class="step-card">
                  <div class="step-badge">0${idx + 1}</div>
                  <h3 class="step-title font-display">${step.title}</h3>
                  <p class="step-desc font-body">${step.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>`

      case 'typography':
        return `
        <div class="section-container" ${secStyleAttr}>
          <div class="section-content">
            <div class="section-header">
              ${data.sectionNumber ? `<span class="section-number">${data.sectionNumber}</span>` : ''}
              <h2 class="section-title font-display">${data.title}</h2>
            </div>
            <div class="fonts-list">
              ${(data.fonts || []).map((font: any) => `
                <div class="font-item">
                  <div class="font-info">
                    <span class="font-role font-mono">${font.role}</span>
                    <h3 class="font-name">${font.name}</h3>
                  </div>
                  <div class="font-sample" style="font-family: '${font.name}', sans-serif;">
                    ${font.sample}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>`

      case 'ux-flow':
        return `
        <div class="section-container" ${secStyleAttr}>
          <div class="section-content">
            <div class="section-header">
              ${data.sectionNumber ? `<span class="section-number">${data.sectionNumber}</span>` : ''}
              <h2 class="section-title font-display">${data.title}</h2>
            </div>
            ${data.description ? `<p class="section-desc font-body">${data.description}</p>` : ''}
            <div class="flow-image-wrapper">
              ${data.image ? `<img src="${data.image}">` : '<div class="img-placeholder">UX Flow Map</div>'}
            </div>
          </div>
        </div>`

      case 'results':
        return `
        <div class="section-container" ${secStyleAttr}>
          <div class="section-content-grid grid-2-col">
            <div>
              <div class="section-header">
                ${data.sectionNumber ? `<span class="section-number">${data.sectionNumber}</span>` : ''}
                <h2 class="section-title font-display">${data.title}</h2>
              </div>
              <p class="body-text font-body">${data.description}</p>
            </div>
            <div class="results-metrics">
              ${(data.metrics || []).map((m: any) => `
                <div class="result-metric-card">
                  <div class="result-metric-value font-mono">${m.value}</div>
                  <div class="result-metric-label font-mono">${m.label}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>`

      default:
        return ''
    }
  }).join('\n')

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.title}</title>
  <style>
    ${fontLink}

    :root {
${cssVariables}
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-x: hidden;
    }

    .font-display {
      font-family: var(--font-display);
    }

    .font-body {
      font-family: var(--font-body);
    }

    .font-mono {
      font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
    }

    /* Layout structure */
    .section-container {
      width: 1600px;
      max-width: 100%;
      margin: 0 auto;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .section-content {
      max-width: 1120px;
      margin: 0 auto;
      width: 100%;
      padding: 0 24px;
      position: relative;
      z-index: 10;
    }

    .section-content-grid {
      max-width: 1120px;
      margin: 0 auto;
      width: 100%;
      padding: 0 24px;
      display: grid;
      gap: 48px;
      align-items: start;
    }

    .grid-12 {
      grid-template-columns: repeat(12, minmax(0, 1fr));
    }

    .col-8 {
      grid-column: span 8 / span 8;
    }

    .col-4 {
      grid-column: span 4 / span 4;
    }

    .grid-2-col {
      grid-template-columns: 1fr 1fr;
    }

    .grid-2-col.reverse {
      direction: rtl;
    }
    .grid-2-col.reverse > * {
      direction: ltr;
    }

    /* Typography utils */
    .text-center { text-align: center; }
    .text-left { text-align: left; }
    .items-center { align-items: center; }
    .items-start { align-items: flex-start; }

    /* Elements */
    .decor-blob {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(170,59,255,0.15) 0%, rgba(255,255,255,0) 70%);
      border-radius: 50%;
      filter: blur(40px);
      pointer-events: none;
    }

    .page-counter {
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.1em;
      opacity: 0.6;
      margin-bottom: 24px;
    }

    .eyebrow {
      font-family: var(--font-body);
      font-size: 12px;
      letter-spacing: 0.2em;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 16px;
      text-transform: uppercase;
    }

    .title {
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin-bottom: 24px;
    }

    .title.text-xl { font-size: 80px; }
    .title.text-lg { font-size: 64px; }
    .title.text-md { font-size: 48px; }

    .subtitle {
      font-size: 20px;
      font-weight: 300;
      line-height: 1.5;
      opacity: 0.8;
      max-width: 680px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .section-number {
      font-family: var(--font-body);
      font-size: 13px;
      opacity: 0.6;
      border: 1px solid var(--border);
      background-color: rgba(255, 255, 255, 0.03);
      padding: 2px 8px;
      border-radius: 4px;
    }

    .section-title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.01em;
      text-transform: uppercase;
    }

    .section-desc {
      font-size: 14px;
      opacity: 0.7;
      margin-top: -12px;
      margin-bottom: 32px;
      max-width: 600px;
    }

    .overview-text, .body-text {
      font-size: 18px;
      font-weight: 300;
      line-height: 1.6;
      opacity: 0.9;
    }

    /* Metrics */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px;
    }

    .metric-card {
      border-left: 2px solid rgba(170,59,255,0.3);
      padding-left: 16px;
      padding-top: 8px;
      padding-bottom: 8px;
    }

    .metric-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 4px;
    }

    .metric-value {
      font-size: 20px;
      font-weight: 700;
      color: #fff;
    }

    /* Color Palette */
    .colors-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 24px;
    }

    .colors-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .color-card {
      background-color: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 12px;
      padding: 12px;
      display: flex;
      flex-direction: column;
    }

    .colors-strip .color-card {
      flex: 1 1 200px;
    }

    .color-swatch {
      width: 100%;
      height: 96px;
      border-radius: 8px;
      margin-bottom: 12px;
    }

    .color-name {
      font-size: 14px;
      font-weight: 600;
      color: #fff;
      margin-bottom: 2px;
    }

    .color-hex {
      font-size: 12px;
      color: var(--accent);
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .color-role {
      font-size: 12px;
      opacity: 0.6;
    }

    /* Mockups */
    .mockups-container {
      display: grid;
      gap: 32px;
    }

    .mockups-container.grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .mockups-container.grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .mockups-container.scattered {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 48px;
    }
    .mockups-container.centered-large {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .mockup-item {
      background-color: rgba(255,255,255,0.01);
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 4 / 5;
      overflow: hidden;
    }

    .mockup-item img {
      max-width: 100%;
      max-height: 100%;
      object-contain: contain;
      border-radius: 8px;
    }

    .mockup-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      opacity: 0.4;
    }

    .device-frame-outline {
      width: 64px;
      height: 120px;
      border: 2px solid currentColor;
      border-radius: 12px;
      margin-bottom: 12px;
    }

    .flow-image-wrapper, .image-wrapper {
      background-color: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 16px;
      padding: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }

    .image-wrapper {
      aspect-ratio: 4 / 3;
    }

    .flow-image-wrapper {
      min-height: 400px;
    }

    .img-placeholder {
      opacity: 0.4;
      font-size: 14px;
      font-family: var(--font-body);
    }

    .image-wrapper img, .flow-image-wrapper img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    /* Steps */
    .steps-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 32px;
    }

    .step-card {
      background-color: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 16px;
      padding: 24px;
      position: relative;
    }

    .step-badge {
      font-size: 12px;
      color: var(--accent);
      font-weight: 700;
      margin-bottom: 16px;
    }

    .step-title {
      font-size: 18px;
      color: #fff;
      margin-bottom: 8px;
    }

    .step-desc {
      font-size: 14px;
      opacity: 0.7;
      line-height: 1.5;
    }

    /* Typography Display */
    .fonts-list {
      display: flex;
      flex-direction: column;
      gap: 48px;
    }

    .font-item {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 32px;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      padding-bottom: 32px;
    }

    .font-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .font-role {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent);
      font-weight: 600;
      display: block;
      margin-bottom: 8px;
    }

    .font-name {
      font-size: 28px;
      font-weight: 800;
      color: #fff;
    }

    .font-sample {
      font-size: 40px;
      letter-spacing: 0.05em;
      font-weight: 300;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Results */
    .results-metrics {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px;
    }

    .result-metric-card {
      background-color: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 16px;
      padding: 24px;
    }

    .result-metric-value {
      font-size: 40px;
      font-weight: 800;
      color: var(--accent);
      margin-bottom: 8px;
    }

    .result-metric-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 0.6;
    }

    /* Footer */
    .footer-content {
      max-width: 1120px;
      margin: 0 auto;
      width: 100%;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 48px;
    }

    .footer-author {
      font-size: 20px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 4px;
    }

    .footer-meta {
      font-size: 13px;
      opacity: 0.6;
    }

    .footer-links {
      display: flex;
      gap: 24px;
    }

    .footer-link {
      color: var(--accent);
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .footer-link:hover {
      text-decoration: underline;
    }

    @media (max-width: 1600px) {
      .section-container {
        width: 100%;
      }
    }

    @media (max-width: 768px) {
      .section-content-grid {
        grid-template-columns: 1fr;
      }
      .col-8, .col-4 {
        grid-column: span 12 / span 12;
      }
      .grid-2-col {
        grid-template-columns: 1fr;
      }
      .font-item {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .footer-content {
        flex-direction: column;
        gap: 24px;
        align-items: flex-start;
      }
      .title.text-xl { font-size: 48px; }
      .title.text-lg { font-size: 40px; }
      .title.text-md { font-size: 32px; }
      .steps-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
${renderedSections}
</body>
</html>`
}
