import { useState } from 'react'

const Blog = ({ blog, blogLike, username, blogDelete }) => {
    const [details, setDetails] = useState(false)
    const toggleDetails = () => {
        setDetails(!details)
    }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const handleRemove = () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            blogDelete()
        }
    }

    if (!details) return (
        <div style={blogStyle}>
            {blog.title} {blog.author} <button onClick={toggleDetails}>view</button>
        </div>
    )

    if (details) return (
        <div style={blogStyle}>
            <div>{blog.title} {blog.author} <button onClick={toggleDetails}>hide</button></div>
            <div>{blog.url}</div>
            <div>likes {blog.likes} <button onClick={blogLike}>like</button></div>
            <div>{blog.user.name}</div>
            {(username === blog.user.username) && <button onClick={handleRemove}>remove</button>}
        </div>
    )
}
export default Blog