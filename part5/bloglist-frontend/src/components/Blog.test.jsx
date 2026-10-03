import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
    test('by default renders title and author and not URL or likes', () => {
        const blog = {
            title: 'test title ',
            author: 'test author',
            url: 'test.link',
            likes: 67,
            user: {
                username: 'testuser',
                name: 'Test User'
            }
        }

        const { container } = render(
            <Blog blog={blog} />
        )

        expect(container).toHaveTextContent('test title')
        expect(container).toHaveTextContent('test author')
        expect(container).not.toHaveTextContent('test.link')
        expect(container).not.toHaveTextContent(67)
    })

    test('renders URL and likes when details are toggled on', async () => {
        const blog = {
            title: 'test title ',
            author: 'test author',
            url: 'test.link',
            likes: 67,
            user: {
                username: 'testuser',
                name: 'Test User'
            }
        }

        const { container } = render(
            <Blog blog={blog} />
        )

        const user = userEvent.setup()
        const button = screen.getByText('view')
        await user.click(button)

        expect(container).toHaveTextContent('test.link')
        expect(container).toHaveTextContent(67)
    })

    test('if the like button is clicked twice, the event handler is called twice', async () => {
        const blog = {
            title: 'test title ',
            author: 'test author',
            url: 'test.link',
            likes: 67,
            user: {
                username: 'testuser',
                name: 'Test User'
            }
        }

        const mockLikeHandler = vi.fn()

        render(
            <Blog blog={blog} blogLike={mockLikeHandler} />
        )

        const user = userEvent.setup()

        const viewButton = screen.getByText('view')
        await user.click(viewButton)

        const likeButton = screen.getByText('like')
        await user.dblClick(likeButton)

        expect(mockLikeHandler.mock.calls).toHaveLength(2)
    })
})
