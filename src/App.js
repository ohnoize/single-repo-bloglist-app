import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ user, setUser ] = useState(null)
  const [ error, setError ] = useState(null)
  const [ notif, setNotif ] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogListUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])




  const handleLogin = async (event) => {
    event.preventDefault()


    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogListUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      setError('Incorrect username or password')
      setTimeout(() => {setError(null)}, 5000)
    }
  }



  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => setBlogs(blogs.concat(returnedBlog)))
      .then(() => {
        setNotif(`Blog by ${blogObject.author} added to the list`)
        setTimeout(() => {setNotif(null)}, 5000)
      })
  }

  const addLike = (blog) => {
    console.log(blog)
    const id = blog.id
    const blogObject = {
      user: blog.user,
      likes: blog.likes,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    console.log('Sent object:', blogObject)
    blogService
      .update(id, blogObject)
      .then((returnedBlog) =>
        setBlogs(blogs.map(b => b.id !== id ? b : returnedBlog))
      )
  }

  const deleteBlog = (blog) => {
    if (window.confirm(`Delete the blog: ${blog.title}?`)) {
      blogService
        .remove(blog.id)
        .then(setBlogs(blogs.filter(a => a.id !== blog.id)))
    }
  }

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <p>
        <Notification message={error} className="error" />
      </p>
      <form onSubmit={handleLogin}>
        <div>
        username
          <input
            type='text'
            id='username'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
        password
          <input
            type='password'
            id='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <div><button id="loginButton" type='Submit'>Login</button></div>
      </form>
    </div>
  )

  const blogList = () => (
    <div>
      <div>
        <h2>Blogs</h2>
        <Notification message={notif} className="notif" />
        {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
          <Blog key={blog.id} blog={blog} updateBlog={addLike} removeBlog={deleteBlog}/>
        )}
      </div>
      <Togglable buttonLabel='Add blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
    </div>
  )

  const logOutButton = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setUser(null)
  }

  return (
    <div>
      {
        user === null ?
          loginForm() :
          <div>

            <p>{user.name} logged in</p>
            <button onClick={logOutButton}>Log out</button>
            {blogList()}
          </div>

      }

    </div>
  )
}

export default App
