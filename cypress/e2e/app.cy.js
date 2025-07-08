describe('Dólar Hoje App E2E', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/')
  })

  it('loads the exchange rate card', () => {
    cy.contains('Cotação em tempo real').should('be.visible')
    cy.get('.exchange-card').should('be.visible')
    cy.get('.exchange-card .rate-value').should('exist')
  })

  it('currency converter converts USD to BRL and handles invalid input', () => {
    cy.get('.converter-card').should('be.visible')
    cy.get('.converter-card input.amount-input').clear().type('10')
    cy.get('.converter-card .converted-amount').should('not.contain', '0,00')
    // Test error handling
    cy.get('.converter-card input.amount-input').clear().type('-5')
    cy.get('.converter-card .input-error').should('be.visible').and('contain', 'inválido')
  })

  it('work calculator calculates net amount and shows error for negative input', () => {
    cy.get('.work-calculator-card').should('be.visible')
    cy.get('input[aria-label="Valor em Dólares (USD)"]').clear().type('1000')
    cy.get('input[aria-label="Taxas e Comissões"]').clear().type('50')
    cy.get('input[aria-label="Impostos e Outras Taxas"]').clear().type('100')
    cy.get('.result-value.net').should('not.contain', 'R$ 0,00')
    // Test error handling
    cy.get('input[aria-label="Taxas e Comissões"]').clear().type('-10')
    cy.get('.input-error').should('be.visible').and('contain', 'negativa')
  })

  it('work calculator extra income and extra tax fields respond to input', () => {
    cy.get('input[aria-label="Renda extra"]').clear().type('200')
    cy.get('.result-value.extra').should('be.visible')
    cy.get('input[aria-label="Taxa sobre renda extra"]').clear().type('20')
    cy.get('.result-value.taxes').last().should('be.visible')
  })
}) 