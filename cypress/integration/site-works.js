describe('Phonebook', function() {
  it('front page can be opened, stuff is clicked', function() {
    cy.visit('http://localhost:3010')
    cy.contains('New number')
    cy.contains('add').click()
    cy.contains('no content')
  })
})