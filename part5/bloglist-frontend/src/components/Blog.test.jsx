import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
    title: 'test title',
    author: 'test author',
    url: 'test.link',
    likes: 67,
    user: {
        username: 'creator',
        name: 'Test Creator'
    }
}

describe('<Blog />', () => {
    test('displays blog information and likes to unauthenticated users without buttons', () => {
        render(<Blog blog={blog} />)

        expect(screen.getByText('test author: test title')).toBeVisible()
        expect(screen.getByRole('link', { name: 'test.link' })).toBeVisible()
        expect(screen.getByText('likes 67')).toBeVisible()
        expect(screen.getByText('Added by Test Creator')).toBeVisible()
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    test('shows only the like button to authenticated users who are not the creator', () => {
        render(
            <Blog blog={blog} username="another-user" />
        )

        expect(screen.getAllByRole('button')).toHaveLength(1)
        expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
    })

    test('shows the like and delete buttons to the blog creator', () => {
        render(
            <Blog blog={blog} username="creator" />
        )

        expect(screen.getAllByRole('button')).toHaveLength(2)
        expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
        expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
    })

    test('calls the like handler twice when the like button is clicked twice', async () => {
        const mockLikeHandler = vi.fn()
        const user = userEvent.setup()

        render(
            <Blog blog={blog} username="another-user" blogLike={mockLikeHandler} />
        )

        await user.dblClick(screen.getByRole('button', { name: 'like' }))

        expect(mockLikeHandler.mock.calls).toHaveLength(2)
    })
})
