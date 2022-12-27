const express = require('express')
const { authenticate } = require('../../middlewares/auth')
const { UserController } = require('./userController')

module.exports = (app) => {
    const router = express.Router()
    router.get('/', authenticate, UserController.getList)
    router.get('/list-friend', authenticate, UserController.getListFriend)
    router.get('/list-block-user', authenticate, UserController.getListBlockUser)
    router.get('/list-friend-request', authenticate, UserController.getListFriendRequest)

    app.use('/api/user', router)
}

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API user
 */

/**
 * @swagger
 * /user/list-friend:
 *   get:
 *     summary: Danh sách bạn bè
 *     tags: [User]
 *     parameters:
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
 *     responses:
 *       "1000":
 *         description: ok!
 */


/**
 * @swagger
 * /user/list-block-user:
 *   get:
 *     summary: Danh sách Chặn
 *     tags: [User]
 *     parameters:
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
 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /user/list-friend-request:
 *   get:
 *     summary: Danh sách lời mời kết bạn
 *     tags: [User]
 *     parameters:
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
 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /user/:
 *   get:
 *     summary: Tìm kiếm người dùng
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: keyword
 *         example:
 *           dang
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

 *     responses:
 *       "1000":
 *         description: ok!
 */
