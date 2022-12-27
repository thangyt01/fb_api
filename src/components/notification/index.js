const express = require('express')
const { authenticate } = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const { NotificationController } = require('./notificationController')
const { NotificationValidator } = require('./notificationValidator')

module.exports = (app) => {
    const router = express.Router()

    router.post('/', authenticate, validate(NotificationValidator.createNotif()), NotificationController.createNotif)
    router.post('/app', authenticate, validate(NotificationValidator.createAppNotif()), NotificationController.createAppNotif)
    router.get('/', authenticate, NotificationController.getNotifications)

    app.use('/api/notif', router)
}

/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: API Notification
 */

/**
 * @swagger
 * /notif/:
 *   get:
 *     summary: Lấy danh sách thông báo
 *     tags: [Notification]
 *
 *     responses:
 *       "1000":
 *         description: ok!
 */