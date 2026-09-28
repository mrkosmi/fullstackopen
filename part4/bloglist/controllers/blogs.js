const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
    response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const { title, author, url, likes } = request.body

    const user = request.user
    if (!user) {
        return response.status(401).json({ error: 'token invalid' })
    }

    const newBlog = new Blog({
        title,
        author,
        url,
        likes,
        user: user._id
    })

    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const user = request.user
    if (!user) {
        return response.status(401).json({ error: 'token invalid' })
    }
    
    const blogToDelete = await Blog.findById(request.params.id)

    if (blogToDelete?.user.toString() !== user._id.toString()) {
        return response.status(401).json({ error: 'unauthorized' })
    } else {
        await Blog.findByIdAndDelete(request.params.id)
        return response.status(204).end()
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body

    const blogToChange = await Blog.findById(request.params.id)

    if (!blogToChange) return response.status(404).end()
    
    blogToChange.title = title
    blogToChange.author = author
    blogToChange.url = url
    blogToChange.likes = likes

    const updatedBlog = await blogToChange.save()
    response.json(updatedBlog)
})
module.exports = blogsRouter

