Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:5000/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedBlogListUser', JSON.stringify(body))
    cy.visit('http://localhost:5000')
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
  cy.request({
    url: 'http://localhost:5000/api/blogs',
    method: 'POST',
    body: {
      title: title,
      author: author,
      url: url
    },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogListUser')).token}`
    }
  })
  cy.visit('http://localhost:5000')
})
