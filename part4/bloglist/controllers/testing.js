const testingRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response) => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    response.status(204).end()
})

testingRouter.post('/quickpost', async (request, response) => {
    const { title, author, url, likes } = request.body
    const user = await User.findOne({})

    const newBlog = new Blog({
        title,
        author,
        url,
        likes,
        user: user._id
    })

    let savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    savedBlog = await savedBlog.populate('user', { username: 1, name: 1, id: 1 })
    response.status(201).json(savedBlog)
})

module.exports = testingRouter