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

  it('calculates extra tax correctly for BRL and USD currencies', () => {
    cy.get('.work-calculator-card').should('be.visible')
    // Set up base values
    cy.get('input[aria-label="Valor em Dólares (USD)"]').clear().type('1000')
    cy.get('input[aria-label="Taxas e Comissões"]').clear().type('0')
    cy.get('input[aria-label="Impostos e Outras Taxas"]').clear().type('0')
    // Add extra income in BRL
    cy.get('select[aria-label="Moeda da renda extra"]').select('BRL')
    cy.get('input[aria-label="Renda extra"]').clear().type('4998')
    // Set extra tax type to percent and currency to BRL
    cy.get('select[aria-label="Tipo de taxa sobre renda extra"]').select('%')
    cy.get('input[aria-label="Taxa sobre renda extra"]').clear().type('13')
    // Should show 13% of 4998 = 649,74 (pt-BR format)
    cy.get('.result-label').contains('Taxas sobre Renda Extra:').parent().find('.result-value.taxes').should('contain', '649,74')
    // Now set extra tax currency to USD and check value
    cy.get('select[aria-label="Moeda da taxa sobre renda extra"]').select('USD')
    // Should show 13% of 4998 USD * exchangeRate (5) = 3248,70
    cy.get('.result-label').contains('Taxas sobre Renda Extra:').parent().find('.result-value.taxes').should('contain', '3.248,70')
    // Check Valor Total Bruto and Desconto Total are visible
    cy.get('.result-label').contains('Valor Total Bruto:').parent().find('.result-value.gross-total').should('exist')
    cy.get('.result-label').contains('Desconto Total:').parent().find('.result-value.discount').should('exist')
  })
}) 