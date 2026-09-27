const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const { nonExistingId } = require('../../../../notes/backend/tests/test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

describe('get blogs', () => {
    test('get returns blogs in json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('get returns correct number of blogs', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('get returns right id', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach((blog) => {
            assert.ok(blog.id)
            assert.strictEqual(blog.__id, undefined)
        })
    }) 
})

describe('post blogs', () => {
    test('posting valid blogs works correctly', async () => {
        const newBlog = {
            title: 'temptitle',
            author: 'tempauthor',
            url: 'tempurl',
            likes: 67
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
        
        const titles = blogsAtEnd.map(b => b.title)
        assert(titles.includes('temptitle'))
    })
    
    test('posting blog with missing likes property defaults to 0', async () => {
        const likelessBlog = {
            title: 'temptitle',
            author: 'tempauthor',
            url: 'tempurl',
        }

        const response = await api
            .post('/api/blogs')
            .send(likelessBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        assert.strictEqual(response.body.likes, 0)
        
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    })

    test('posting without title or url returns 400 Bad Request', async () => {
        const invalidBlog = {
            author: "dummy",
            likes: 42
        }

        await api
            .post('/api/blogs')
            .send(invalidBlog)
            .expect(400)
    })
})

describe('blog delete', () => {
    test('succesfully deletes blog and returns status code 204', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
        
        const blogsAtEnd = await helper.blogsInDb()
        const ids = blogsAtEnd.map(b => b.id)
        assert(!ids.includes(blogToDelete.id))

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test('delete of an invalid id returns 204 and doesnt change db', async () => {
        const id = await helper.nonExistingId()
        await api
            .delete(`/api/blogs/${id}`)
            .expect(204)
        
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
})

describe('updating a blog', () => {
    test('updates details successfully', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const updatedBlog = { ...blogsAtStart[0], likes: blogsAtStart[0].likes + 1}

        await api
            .put(`/api/blogs/${updatedBlog.id}`)
            .send(updatedBlog)
            .expect(200)
        
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

        const blogInDb = blogsAtEnd.find(b => b.id === updatedBlog.id)
        assert.deepStrictEqual(blogInDb, updatedBlog)
    })
})

after(async () => {
    await mongoose.connection.close()
})