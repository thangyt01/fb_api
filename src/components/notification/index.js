const express = require('express')
const { authenticate } = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const { NotificationController } = require('./notificationController')
const { NotificationValidator } = require('./notificationValidator')

module.exports = (app) => {
    const router = express.Router()

    router.post('/', authenticate, validate(NotificationValidator.createNotif()), NotificationController.createNotif)
    router.post('/app', authenticate, validate(NotificationValidator.createAppNotif()), NotificationController.createAppNotif)
    router.get('/', authenticate,  NotificationController.getNotifications)

    app.use('/api/notif', router)
}

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: API comment
 */

/**
 * @swagger
 * /comment/{postId}:
 *   get:
 *     summary: Lấy danh sách bình luận của bài viết
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *         example:
 *           63536d2fde80401beccdb42f
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
 *       - in: query
 *         name: reply_id
 *         schema:
 *           type: string
 *         description: reply_id
 *         example:
 *           6355f72a7981171e9c857af1
 *
 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /comment/{postId}:
 *   post:
 *     summary: Tạo 1 comment mới
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *         example:
 *           63536d2fde80401beccdb42f
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               content: Comment mới
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
 * /comment/{commentId}:
 *   put:
 *     summary: Sửa comment
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment id
 *         example:
 *           6357ef884301a07318cb6a28
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               content: Comment mới
 *               media_url:
 *                    url: https://media.vov.vn/sites/default/files/styles/large/public/2021-08/man_city_vs_norwich.jpg
 *                    type: image
 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /comment/{commentId}:
 *   delete:
 *     summary: Xóa 1 comment (xóa mềm)
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment id
 *         example:
 *           6357ef884301a07318cb6a28
 *     responses:
 *       "1000":
 *         description: ok!
 */
