import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

let component
const blog = {
  title: 'Testblog',
  author: 'Mr. Testman',
  url: 'www.testblog.com',
  likes: '777',
  user: {
    name: 'testman'
  }
}

describe('blog rendering', () => {

  beforeEach(() => {
    component = render(
      <Blog blog={blog} />
    )
  })

test('renders title and author', () => {
  expect(component.container).toHaveTextContent(
    'Testblog'
  )
})

test('extra info not displayed', () => {
  const div = component.container.querySelector('.extraInfo')
  expect(div).toHaveStyle('display: none')
})

test('extra info displayed after button pressed', () => {
  const button = component.getByText('Show')
  fireEvent.click(button)
  const div = component.container.querySelector('.extraInfo')
  expect(div).not.toHaveStyle('display: none')
})

})

describe('like button', () => {

test('like button works as intended', () => {
  const mockHandler = jest.fn()
  component = render(
    <Blog blog={blog} updateBlog={mockHandler} />
  )
  const button = component.getByText('Like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
})
