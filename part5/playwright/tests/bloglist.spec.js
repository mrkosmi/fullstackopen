const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'Marcel Kosmala',
                username: 'mlodykosmi',
                password: 'zgaslo'
            }
        })

        await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByText('log in to application')).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'mlodykosmi', 'zgaslo')

            await expect(page.getByText('Marcel Kosmala logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'mlodykosmi', 'wrong')

            await expect(page.getByText('Marcel Kosmala logged in')).not.toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'mlodykosmi', 'zgaslo')
        })

        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'mock-title', 'mock-author', 'mock-url')
            
            await expect(page.getByText('a new blog mock-title by mock-author added')).toBeVisible()
            await expect(page.getByText('mock-title mock-author')).toBeVisible()
        })

        describe('and a blog exists', () => {
            beforeEach(async ({ page }) => {
                await createBlog(page, 'mock-title', 'mock-author', 'mock-url')
            })

            test('blog can be liked', async ({ page }) => {
                await page.getByRole('button', { name: 'view' }).click()
                await page.getByRole('button', { name: 'like' }).click()

                await expect(page.getByText('likes 1')).toBeVisible()
            })

            test('can delete own blog', async ({ page }) => {
                page.on('dialog', (dialog) => dialog.accept())

                await page.getByRole('button', { name: 'view' }).click()
                await page.getByRole('button', { name: 'remove' }).click()

                await expect(page.getByText('mock-title mock-author')).not.toBeVisible()
            })

            test('only the owner sees delete button', async ({ page, request }) => {
                await request.post('/api/users', {
                    data: {
                        name: 'Another User',
                        username: 'other',
                        password: 'pass'
                    }
                })

                await page.getByText('view').click()
                await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

                await page.getByRole('button', { name: 'logout' }).click()
                await loginWith(page, 'other', 'pass')

                await page.getByText('view').click()
                await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
            })
        })

        test('blogs are ordered according to the likes', async ({ page, request }) => {
            await request.post('/api/testing/quickpost', {
                data: {
                    title: 'first blog',
                    author: 'first author',
                    url: 'first.url',
                    likes: 5
                }
            })
            await request.post('/api/testing/quickpost', {
                data: {
                    title: 'second blog',
                    author: 'second author',
                    url: 'second.url',
                    likes: 2
                }
            })
            await request.post('/api/testing/quickpost', {
                data: {
                    title: 'third blog',
                    author: 'third author',
                    url: 'third.url',
                    likes: 12
                }
            })

            await page.reload()

            const views = page.getByRole('button', { name: 'view' })

            await expect(views).toHaveCount(3)
            await expect(views.nth(0).locator('..')).toHaveText('third blog third author view')
            await expect(views.nth(1).locator('..')).toHaveText('first blog first author view')
            await expect(views.nth(2).locator('..')).toHaveText('second blog second author view')
        })
    })
})