const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const tokenExtractor = require('../utils/middleware')


blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })
  res.json(blogs.map(blog => blog.toJSON()))
    })

blogRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('user', { name: 1, username: 1 })
  res.json(blog.toJSON())
    })



blogRouter.delete('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  const user = blog.user
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (user.toString() === decodedToken.id) {
  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
} else res.status(400).end()
})


blogRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log(decodedToken)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'invalid or missing token'})
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id
  })
  if (!blog.title && !blog.url) {
    response.status(400).end()
  } else {

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog.toJSON())
    }
  }
)

blogRouter.put('/:id', async (req, res) => {
  const body = req.body
  console.log(body)
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    name: body.user.name
  }
  const updatedNote = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true }).populate('user', { name: 1, username: 1 })
  res.json(updatedNote.toJSON())
  console.log(updatedNote.toJSON())
})

module.exports = blogRouter
