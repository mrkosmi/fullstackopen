import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        if (notification) {
            setTimeout(() => {
                setNotification(null)
            }, 3000)
        }
    }, [notification])

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs.toSorted((a, b) => b.likes - a.likes))
        )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const userLogin = async (username, password) => {
        try {
            const user = await loginService.login({ username, password })

            window.localStorage.setItem(
                'loggedUser', JSON.stringify(user)
            )

            blogService.setToken(user.token)
            setUser(user)
        } catch (error) {
            setNotification({
                message: error.response.data.error,
                error: true
            })
        }
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedUser')

        blogService.setToken(null)
        setUser(null)
    }

    const blogCreate = async blog => {
        blogFormRef.current.toggleVisibility()
        try {
            const savedBlog = await blogService.create(blog)
            setBlogs(blogs.concat(savedBlog))

            setNotification({
                message: `a new blog ${savedBlog.title} by ${savedBlog.author} added`,
                error: false
            })

            console.log(blogs)
        } catch (error) {
            setNotification({
                message: error.response.data.error,
                error: true
            })
        }
    }

    const blogLike = async blog => {
        try {
            const changedBlog = await blogService.update(blog.id, { ...blog, likes: blog.likes + 1 })
            setBlogs(blogs.map(b => b.id === blog.id ? changedBlog : b).toSorted((a, b) => b.likes - a.likes))
        } catch (error) {
            setNotification({
                message: error.response.data.error,
                error: true
            })
        }
    }

    const blogDelete = async blog => {
        try {
            await blogService.remove(blog.id)
            setBlogs(blogs.filter(b => b.id !== blog.id))
        } catch (error) {
            setNotification({
                message: error.response.data.error,
                error: true
            })
        }
    }

    const blogFormRef = useRef()
    const blogsView = () => (
        <div>
			<h2>blogs</h2>
			<p>
				{user.name} logged in
				<button onClick={handleLogout}>logout</button>
			</p>

			<Togglable ref={blogFormRef} buttonLabel='create new blog'>
				<BlogForm blogCreate={blogCreate} />
			</Togglable>

			{blogs.map(blog =>
				<Blog key={blog.id} blog={blog} blogLike={() => blogLike(blog)} username={user.username} blogDelete={() => blogDelete(blog)}/>
			)}
        </div>
    )

    return (
        <div>
			<Notification notification={notification} />
			{!user && <LoginForm login={userLogin} />}
			{user && blogsView()}
        </div>
    )
}

export default App