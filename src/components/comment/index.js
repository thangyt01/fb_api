const express = require('express')
const { authenticate } = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const { CommentController } = require('./commentController')
const { CommentValidator } = require('./commentValidator')

module.exports = (app) => {
    const router = express.Router()

    router.get('/:postId', authenticate, CommentController.get)
    router.post('/:postId', authenticate, validate(CommentValidator.create()), CommentController.create)

    // // sửa bài đăng
    // router.put('/:id', authenticate, validate(PostValidator.edit()), PostController.edit)

    // router.delete('/:id', authenticate, PostController.delete)

    app.use('/api/comment', router)
}