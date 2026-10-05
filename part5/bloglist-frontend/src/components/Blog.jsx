const Blog = ({ blog, blogLike, username, blogDelete }) => {

    const handleRemove = () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            blogDelete()
        }
    }

    if (!blog) return null
    return (
        <div>
            <h2>{blog.author}: {blog.title} </h2>
            <a href={blog.url}>{blog.url}</a>
            <div>likes {blog.likes} {username && <button onClick={blogLike}>like</button>}</div>
            <div>Added by {blog.user.name}</div>
            {(username && username === blog.user.username) && <button onClick={handleRemove}>remove</button>}
        </div>
    )
}
export default Blog