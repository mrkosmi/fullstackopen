import { useState, useEffect } from 'react'
import {
    BrowserRouter as Router,
    Link, Route, Routes, useMatch, useNavigate
} from 'react-router-dom'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'

import blogService from './services/blogs'
import loginService from './services/login'



const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [notification, setNotification] = useState(null)

    const navigate = useNavigate()

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

        navigate('/')
        blogService.setToken(null)
        setUser(null)
    }

    const blogCreate = async blog => {
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
        navigate('/')
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
        navigate('/')
    }

    const padding = { padding: 5 }

    const match = useMatch('/blogs/:id')
    const blog = match
        ? blogs.find(b => b.id === match.params.id)
        : null

    return (
        <div>
            <Notification notification={notification} />

            <Link to='/' style={padding}>blogs</Link>
            {!user && <Link to='/login' style={padding}>login</Link>}
            {user && (
                <>
                    <Link to='/create' style={padding}>new blog</Link>
                    <button onClick={handleLogout} style={padding}>logout</button>
                </>
            )}

            <Routes>
                <Route path='/' element={
                    <BlogList blogs={blogs} user={user} blogLike={blogLike} blogDelete={blogDelete} />
                } />
                <Route path='/login' element={
                    <LoginForm login={userLogin} />
                } />
                <Route path='/blogs/:id' element={
                    <Blog
                        blog={blog}
                        blogLike={() => blogLike(blog)}
                        username={user?.username}
                        blogDelete={() => blogDelete(blog)}
                    />
                } />
                <Route path='/create' element={
                    <BlogForm blogCreate={blogCreate} />
                } />
            </Routes>
        </div>
    )
}

export default App