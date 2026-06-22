describe('BeBrief Studio E2E Tests', () => {
  beforeEach(() => {
    // Visit Dashboard
    cy.visit('/')
  })

  it('should display the dashboard and template presets', () => {
    cy.get('h2').should('contain', 'Crea Case Studies')
    cy.get('span').should('contain', 'Crear desde Plantilla')
  })

  it('should allow creating and editing a brief', () => {
    // Create new project from Dark Editorial template
    cy.contains('Dark Editorial').click()

    // Editor should load (SPA — URL stays at /, check canvas is present)
    cy.get('#brief-canvas-export').should('exist')

    // Click on Vista Previa to toggle fullscreen
    cy.contains('Vista Previa').click()
    cy.get('header').should('contain', 'Imprimir PDF')

    // Toggle back to Editar
    cy.contains('Editar').click()

    // Return to dashboard
    cy.get('button[title="Volver al Dashboard"]').click()
    cy.get('h2').should('contain', 'Crea Case Studies')
  })
})
