import { useState } from 'react'

const BlogForm = ({ blogCreate }) => {
    const [blog, setBlog] = useState({
        title: '',
        author: '',
        url: ''
    })

    const handleCreate = async event => {
        event.preventDefault()
        await blogCreate(blog)
        setBlog({
            title: '',
            author: '',
            url: ''
        })
    }

    return (
        <>
        <h2>create new</h2>
        <form onSubmit={handleCreate}>
            <div>
                <label>
            title:
                    <input value={blog.title} onChange={({ target }) => setBlog({ ...blog, title: target.value })} />
                </label>
            </div>
            <div>
                <label>
            author:
                    <input value={blog.author} onChange={({ target }) => setBlog({ ...blog, author: target.value })} />
                </label>
            </div>
            <div>
                <label>
            url:
                    <input value={blog.url} onChange={({ target }) => setBlog({ ...blog, url: target.value })} />
                </label>
            </div>
            <button type='submit'>create</button>
        </form>
        </>
    )
}

export default BlogForm