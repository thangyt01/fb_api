const express = require('express')
const { authenticate } = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const { PostController } = require('./postController')
const { PostValidator } = require('./postValidator')

module.exports = (app) => {
    const router = express.Router()

    // tạo bài đăng
    router.post('/', authenticate, validate(PostValidator.create()), PostController.create)

    // sửa bài đăng
    router.put('/:id', authenticate, validate(PostValidator.edit()), PostController.edit)

    router.delete('/:id', authenticate, PostController.delete)

    app.use('/api/post', router)
}