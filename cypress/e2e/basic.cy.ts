describe('empty spec', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays the resources text', () => {
    cy.get('h2').contains('Found a phone? Find the owner.')
  })
  it('renders the background', () => {
    cy.get('svg')
      .should('be.visible')
      .and(($svg) => {
        expect($svg[0].naturalWidth).to.be.greaterThan(0)
      })
  })
})
