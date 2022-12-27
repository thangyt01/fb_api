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

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: API Chat
 */

/**
 * @swagger
 * /chat/:
 *   get:
 *     summary: Lấy danh sách các cuộc hội thoại
 *     tags: [Chat]

 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /chat/{userId}:
 *   get:
 *     summary: Lấy danh sách tin nhắn của một cuộc hội thoại theo userId, nếu chưa có thì sẽ tạo 1 cuộc hội thoại
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: number
 *         required: true
 *         description: The user id
 *         example:
 *           2
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *         description: limit
 *         example:
 *           10
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: page
 *         example:
 *           0
 *
 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /chat/:
 *   post:
 *     summary: Tạo 1 tin nhắn mới
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               group_chat_id: 63a72ea8b3d2fd6bb888af84
 *               content: Tin nhắn mới
 *               media_url:
 *                    url: https://media.vov.vn/sites/default/files/styles/large/public/2021-08/man_city_vs_norwich.jpg
 *                    type: image
 *               reply_id: 63536d2fde80401beccdb42f
 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /chat/group-chat/{groupChatId}:
 *   get:
 *     summary: Lấy danh sách tin nhắn của một cuộc hội thoại theo groupChatId
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: groupChatId
 *         schema:
 *           type: string
 *         required: true
 *         description: The group chat id
 *         example:
 *           63a72ea8b3d2fd6bb888af84
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *         description: limit
 *         example:
 *           10
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: page
 *         example:
 *           0
 *
 *     responses:
 *       "1000":
 *         description: ok!
 */