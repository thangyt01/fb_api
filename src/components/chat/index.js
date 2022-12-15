const express = require('express')
const { authenticate } = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const { ChatController } = require('./chatController')
const { ChatValidator } = require('./chatValidator')

module.exports = (app) => {
    const router = express.Router()

    router.post('/', authenticate, validate(ChatValidator.create()), ChatController.create)
    router.get('/group-chat/:groupChatId', authenticate, ChatController.getGroupChat)
    router.get('/:userId', authenticate, ChatController.get)
    router.get('/', authenticate, ChatController.gets)

    app.use('/api/chat', router)
}
