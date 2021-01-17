const express = require('express')
const app = express()

// Heroku dynamically sets a port
const PORT = process.env.PORT || 5000

app.use(express.static('dist'))

app.get('/health', (_, res) => {
  res.send('ok')
})

app.get('/ping', (_, res) => {
  res.send('pong')
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('server started on port 5000')
})


