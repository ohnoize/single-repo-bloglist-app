import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {

  const [ title, setTitle ] = useState('')
  const [ author, setAuthor ] = useState('')
  const [ url, setUrl ] = useState('')

  const handleTitleChange = event => {
    console.log(event.target.value)
    setTitle(event.target.value)
  }

  const handleAuthorChange = event => {
    console.log(event.target.value)
    setAuthor(event.target.value)
  }

  const handleUrlChange = event => {
    console.log(event.target.value)
    setUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }


  return (
    <div className="formDiv">
      <h3>Create new</h3>
      <form onSubmit={addBlog}>
        <div>
          Title: <input
            id='title'
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          Author: <input
            id='author'
            value={author}
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          URL: <input
            id='url'
            value={url}
            onChange={handleUrlChange}
          />
        </div>
        <div>
          <button id="submitNew" type="submit">Add</button>
        </div>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
