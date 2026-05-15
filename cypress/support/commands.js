/**
 * Comandos customizados do Cypress.
 * Encapsulam fluxos repetitivos para manter os testes legíveis.
 */

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('[data-cy=email]').type(email);
  cy.get('[data-cy=password]').type(password);
  cy.get('[data-cy=submit]').click();
  cy.url().should('include', '/dashboard');
});
