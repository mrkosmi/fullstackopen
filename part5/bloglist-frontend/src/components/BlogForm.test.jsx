import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('blog create handler called with right details', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm blogCreate={createBlog} />)

    let input = screen.getByLabelText('title:')
    await user.type(input, 'test title')

    input = screen.getByLabelText('author:')
    await user.type(input, 'test author')

    input = screen.getByLabelText('url:')
    await user.type(input, 'test.link')

    const button = screen.getByText('create')
    await user.click(button)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual(
        {
            title: 'test title',
            author: 'test author',
            url: 'test.link'
        }
    )
})