import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, removeBlog }) => {

  const blogStyle = {
    paddingTop: 5,
    paddingLeft: 2,
    marginBottom: 5,
    paddingRight: 2,
    border: 'solid',
    borderWidth: 1
  }



  const [ visible, setVisible ] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

let showWhenLogged = { display: 'none' }
  if (window.localStorage.loggedBlogListUser) {
  const loggedUser = JSON.parse(window.localStorage.loggedBlogListUser)




  if (loggedUser.name === blog.user.name) {
    showWhenLogged = { display: '' }
  }
}

  const addLike = (blog) => {
    updateBlog({
      user: blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      name: blog.user.name,
      url: blog.url,
      id: blog.id
    })
  }

  const deleteBlog = (blog) => {
    removeBlog({
      id: blog.id,
      title: blog.title
    })
  }

  return (

    <div id='blogInfo' style={blogStyle}>
      {blog.title} {blog.author}
      <button id='showButton' style={hideWhenVisible} onClick={toggleVisibility}>Show</button>
      <button id='hidebutton' style={showWhenVisible} onClick={toggleVisibility}>Hide</button>
      <div className='extraInfo' style={showWhenVisible}>
        <p>Url: {blog.url}</p>
        <p>Likes: {blog.likes} <button id='likeButton' onClick={() => addLike(blog)}>Like</button></p>
        <p>Name: {blog.user.name}</p>
        <p><button id='removeButton' style={showWhenLogged} onClick={() => deleteBlog(blog)}>Remove</button></p>
      </div>
    </div>
  )
}
Blog.propTypes = {
  blog: PropTypes.object.isRequired
}
export default Blog
