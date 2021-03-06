const config = require('./utils/config')
const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')



mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  // eslint-disable-next-line no-console
  .then(console.log('Connected to MongoDB'))
  // eslint-disable-next-line no-console
  .catch(error => console.log('Error: ', error.message))


app.use(express.json())
app.use(cors())
app.use(middleware.tokenExtractor)
app.use('/blogs', blogRouter)
app.use('/users', userRouter)
app.use('/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/testing', testingRouter)
}

module.exports = app
