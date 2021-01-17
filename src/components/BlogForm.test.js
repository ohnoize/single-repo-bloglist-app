import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('Blog form', () => {
  let component
  const createBlog = jest.fn()
  component = render(
    <BlogForm createBlog={createBlog} />
  )
  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'Testing forms'}
  })
  fireEvent.change(author, {
    target: { value: 'Testy Testman'}
  })
  fireEvent.change(url, {
    target: { value: 'www.testurl.com'}
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing forms',
    author: 'Testy Testman',
    url: 'www.testurl.com'
  })

})
