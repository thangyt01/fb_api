const express = require('express')
const { authenticate } = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const { CommentController } = require('./commentController')
const { CommentValidator } = require('./commentValidator')

module.exports = (app) => {
    const router = express.Router()

    router.get('/:postId', authenticate, CommentController.get)
    router.post('/:postId', authenticate, validate(CommentValidator.create()), CommentController.create)

    // sửa bình luận
    router.put('/:commentId', authenticate, validate(CommentValidator.edit()), CommentController.edit)
    router.delete('/:commentId', authenticate, CommentController.delete)

    app.use('/api/comment', router)
}