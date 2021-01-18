describe('blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:5000/api/testing/reset')
    const user = {
      name: 'Olli Hirvonen',
      username: 'olhirvon',
      password: 'salasana1234'
    }
    const secondUser = {
      name: 'Merrily Rosso',
      username: 'merruth',
      password: 'nena666'
    }
    cy.request('POST', 'http://localhost:5000/api/users', user)
    cy.request('POST', 'http://localhost:5000/api/users', secondUser)
    cy.visit('http://localhost:5000')
  })
  it('login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
  })
  it('login succeeds with right creds', function() {
    cy.get('#username').type('olhirvon')
    cy.get('#password').type('salasana1234')
    cy.get('#loginButton').click()

    cy.contains('Olli Hirvonen logged in')
  })
  it('login fails with wrong creds', function() {
    cy.get('#username').type('olhirvon')
    cy.get('#password').type('wrong')
    cy.get('#loginButton').click()

    cy.get('.error').contains('Incorrect username or password')
  })
  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'olhirvon', password: 'salasana1234' })
    })
    it('blog can be added', function() {
      cy.contains('Add blog').click()
      cy.get('#title').type('Blog added by cypress')
      cy.get('#author').type('Mr. Cypress')
      cy.get('#url').type('www.testurl.com')
      cy.get('#submitNew').click()
      cy.contains('Blog added by cypress Mr. Cypress')
    })
    describe('when blogs added', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'Another cypress blog',
          author: 'Cypress man',
          url: 'www.testblog.com'
        })
        cy.createBlog({
          title: 'Second cypress blog',
          author: 'Cypress man',
          url: 'www.testblog.com'
        })
        cy.createBlog({
          title: 'Third cypress blog',
          author: 'Cypress man',
          url: 'www.testblog.com'
        })
        cy.contains('Another').parent().parent().as('blog1')
        cy.contains('Second').parent().parent().as('blog2')
        cy.contains('Third').parent().parent().as('blog3')
      })
      it('blog can be liked', function() {
        cy.get('#showButton').click()
        cy.wait(2000)
        cy.get('#likeButton').click()
        cy.wait(2000)
        cy.get('#likeButton').click()
        cy.wait(2000)
        cy.contains('Likes: 2')
      })
      it('blog can be removed', function() {
        cy.get('#showButton').click()
        cy.get('#removeButton').click()
        cy.get('html').should('not.contain', 'Another cypress blog')
      })
      it('blog cannot be removed by other user', function() {
        cy.contains('Log out').click()
        cy.get('#username').type('merruth')
        cy.get('#password').type('nena666')
        cy.get('#loginButton').click()
        cy.get('#showButton').click()
        cy.get('#removeButton').should('not.be.visible')
      })
      it('the blog with most likes is at the top', function() {
        cy.get(':nth-child(2) > #showButton').click()
        cy.get(':nth-child(2) > .extraInfo > :nth-child(2) > #likeButton').click()
        cy.get(':nth-child(4) > #showButton').click()
        cy.get(':nth-child(4) > .extraInfo > :nth-child(2) > #likeButton').click().click()
        cy.wait(2000)
        cy.get('#blogInfo').should('contain', 'Third cypress blog') //the div id only takes the first instance, so we will see if the blog with most votes is at the top
        cy.get('#blogInfo').should('not.contain', 'Another cypress blog')
      })
    })
  })
})
