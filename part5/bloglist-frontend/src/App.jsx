import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [blog, setBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const [notification, setNotification] = useState(null)

  useEffect(() => {
    console.log('poszlo noti')
    if (notification) {
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }, [notification])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)

      setUsername('')
      setPassword('')
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

  const handleCreate = async event => {
    event.preventDefault()
    
    try {
      const savedBlog = await blogService.create(blog)

      setBlogs(blogs.concat(savedBlog))
      setBlog({
        title: '',
        author: '',
        url: ''
      })

      setNotification({
        message: `a new blog ${savedBlog.title} by ${savedBlog.author} added`,
        error: false
      })
    } catch (error) {
      setNotification({
        message: error.response.data.error,
        error: true
      })
    }
  }

  const loginForm = () => (
    <>
    <h1>log in to application</h1>
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
    </>
  )

  const blogsView = () => (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>  
      </p> 

      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          <label>
            title:
            <input value={blog.title} onChange={({ target }) => setBlog({...blog, title: target.value})} />
          </label>
        </div>
        <div>
        <label>
            author:
            <input value={blog.author} onChange={({ target }) => setBlog({...blog, author: target.value})} />
          </label>
        </div>
        <div>
        <label>
            url:
            <input value={blog.url} onChange={({ target }) => setBlog({...blog, url: target.value})} />
          </label>
        </div>
        <button type='submit'>create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <div>
    <Notification notification={notification} />
    {!user && loginForm()}
    {user && blogsView()}
    </div>
  )
}

export default App