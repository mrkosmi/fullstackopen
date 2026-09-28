const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

const app = express()

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl, { family: 4 })
    .then(() => console.log('connected to db'))
    .catch(error => console.log('couldn\'t connect to db:', error.message))

app.use(express.json())
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.errorHandler)

module.exports = app
