import { useState } from 'react'

import { TextField, Button } from '@mui/material'

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

    const pad = { marginBottom: 10 }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={handleCreate}>
                <div>
                    <TextField
                        style={pad}
                        label='title'
                        value={blog.title}
                        onChange={({ target }) => setBlog({ ...blog, title: target.value })}
                    />
                </div>
                <div>
                    <TextField
                        style={pad}
                        label="author"
                        value={blog.author}
                        onChange={({ target }) => setBlog({ ...blog, author: target.value })}
                    />
                </div>
                <div>
                    <TextField
                        style={pad}
                        label='url'
                        value={blog.url}
                        onChange={({ target }) => setBlog({ ...blog, url: target.value })}
                    />
                </div>
                <Button variant='contained' type='submit'>create</Button>
            </form>
        </div>
    )
}

export default BlogForm