const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const result = await blog.save()
    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
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

