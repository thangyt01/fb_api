const express = require('express')
const { authenticate } = require('../../middlewares/auth')
const { UserController } = require('./userController')

module.exports = (app) => {
    const router = express.Router()
    router.get('/list-friend', authenticate, UserController.getListFriend)
    router.get('/list-block-user', authenticate, UserController.getListBlockUser)
    router.get('/find-user', authenticate, UserController.findUser)
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
 *     responses:
 *       "1000":
 *         description: ok!
 */
