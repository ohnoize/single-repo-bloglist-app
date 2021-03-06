const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const helper = require('./test_helper')
const api = supertest(app)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

describe('tests for adding and deleting blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

  test('right amount of blogs returned', async () => {
    const response = await api.get('/blogs')
    console.log(response.body)
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('make sure id value is formatted correctly', async () => {
    const response = await helper.blogsInDb()
    const firstValue = response[0]
    expect(firstValue.id).toBeDefined()
  })

  test('make sure adding blogs works', async () => {

    const newBlog = {
      title: 'Testblog',
      author: 'Olli Hirvonen',
      url: 'http://www.ollihirvonen.com',
      likes: '666',
    }

    const user = await User.findOne({ username: 'root' })

    const forToken = {
      username: user.username,
      id: user._id
    }

    const token = jwt.sign(forToken, process.env.SECRET)

    console.log(token)

    await api
      .post('/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const response = await helper.blogsInDb()
    console.log(response)
    const titles = response.map(r => r.title)
    console.log(titles)
    expect(response).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain('Testblog')
  })

  test('make sure every blog has at least 0 likes', async () => {
    const newBlog = {
      title: 'Testblog',
      author: 'Olli Hirvonen',
      url: 'http://www.ollihirvonen.com'
    }

    const user = await User.findOne({ username: 'root' })

    const forToken = {
      username: user.username,
      id: user._id
    }

    const token = jwt.sign(forToken, process.env.SECRET)

    await api
      .post('/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)

    const response  = await helper.blogsInDb()
    console.log(response)
    const justAdded = response[response.length - 1]
    console.log(justAdded)
    expect(justAdded.likes).toBe(0)
  })

  test('make sure of 400 error if no title and url', async () => {
    const newBlog = {
      author: 'Olli Hirvonen'
    }

    const user = await User.findOne({ username: 'root' })

    const forToken = {
      username: user.username,
      id: user._id
    }

    const token = jwt.sign(forToken, process.env.SECRET)

    await api
      .post('/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('make sure deleting blogs work', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToAdd = {
      title: 'Doomed blog',
      author: 'Olli Hirvonen',
      url: 'http://www.ollihirvonen.com'
    }

    const user = await User.findOne({ username: 'root' })

    const forToken = {
      username: user.username,
      id: user._id
    }

    const token = jwt.sign(forToken, process.env.SECRET)

    await api
      .post('/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(blogToAdd)

    const blogsInMiddle = await helper.blogsInDb()
    expect(blogsInMiddle).toHaveLength(blogsAtStart.length + 1)

    const blogToDelete = await Blog.findOne({ title: 'Doomed blog' })

    await api
      .delete(`/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsInMiddle.length - 1)
    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).not.toContain(blogToAdd.title)
  })

  test('make sure updating blogs works', async () => {
    const [ blogToUpdate ] = await helper.blogsInDb()
    console.log(blogToUpdate)
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
    console.log(updatedBlog)
    await api
      .put(`/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const edited = blogsAtEnd.find(b => b.url === blogToUpdate.url)
    expect(edited.likes).toBe(blogToUpdate.likes + 1)
  })

})


describe('tests for user database', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })
  test('creating user with invalid information fails', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'test',
      name: 'Testname',
      password: 'se'
    }

    await api
      .post('/users')
      .send(newUser)
      .expect(400 || 500)


    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    const names = usersAtEnd.map(u => u.name)
    expect(names).not.toContain('Testname')
  })
})

afterAll(() => {
  mongoose.connection.close()
})
