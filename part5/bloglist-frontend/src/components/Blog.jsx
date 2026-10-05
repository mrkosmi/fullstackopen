import { Card, CardContent, Typography, Link, Button, CardActions } from '@mui/material'

const Blog = ({ blog, blogLike, username, blogDelete }) => {

    const handleRemove = () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            blogDelete()
        }
    }

    if (!blog) return null
    return (
        <Card sx={{ maxWidth: 600, mt: 4 }}>
            <CardContent>
                <Typography variant='h5' color='textPrimary' sx={{ fontWeight: 'bold', mb: 1 }}>
                    {blog.title}
                </Typography>
                <Typography variant='subtitle1' color='textSecondary' sx={{ mb: 1 }}>
                    by {blog.author}
                </Typography>
                <Link
                    href={blog.url}
                    sx={{ display: 'block', mb: 1 }}
                >
                    {blog.url}
                </Link>
                <Typography variant='body1' color='textSecondary'>
                    Added by {blog.user.name}
                </Typography>
            </CardContent>

            <CardActions>
                <Typography variant='body1' color='textPrimary'>
                    {blog.likes} likes
                </Typography>

                { username && <Button
                    variant='outlined'
                    color='primary'
                    onClick={blogLike}
                >
                    LIKE
                </Button> }

                { (username && username === blog.user.username) && <Button
                    variant='outlined'
                    color='error'
                    onClick={handleRemove}
                >
                    REMOVE
                </Button> }
            </CardActions>
        </Card>
    )
}
export default Blog