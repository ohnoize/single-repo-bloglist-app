const express = require('express')
const path = require('path')
const app = express()

// Heroku dynamically sets a port
const PORT = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, 'dist')))

app.use('/api', (req, res, next) => require('./server')(req, res, next))

app.get('/health', (_, res) => {
  res.send('ok')
})

app.get('/ping', (_, res) => {
  res.send('pong')
})

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('server started on port 5000')
})


