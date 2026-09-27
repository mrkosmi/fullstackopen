const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, cur) => sum + cur.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null

    const favorite = blogs.reduce((favorite, current) => 
        favorite.likes > current.likes ? favorite : current 
    )
        
    return { ...favorite }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

    const countByAuthor = lodash.countBy(blogs, (blog) => blog.author)
    const authorsWithCounts = lodash.map(countByAuthor, (count, author) => {
        return {
            author,
            blogs: count
        }
    })

    return lodash.maxBy(authorsWithCounts, 'blogs')
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null

    const groupedByAuthor = lodash.groupBy(blogs, 'author')
    const authorsWithLikes = lodash.map(groupedByAuthor, (authorsBlogs, author) => {
        return {
            author,
            likes: lodash.sumBy(authorsBlogs, 'likes')
        }
    })

    return lodash.maxBy(authorsWithLikes, 'likes')
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }