const express = require('express')
const { authenAppToken } = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const { ActionLogController } = require('./actionLogController')
const { ActionLogValidator } = require('./actionLogValidator')

module.exports = (app) => {
    const router = express.Router()
    router.post('/firebase-token', authenAppToken, validate(ActionLogValidator.firebaseToken()), ActionLogController.updateFirebaseToken)

    app.use('/api/action', router)
}

/**
 * @swagger
 * tags:
 *   name: Action Log
 *   description: Action Log
 */

/**
 * @swagger
 * /action/firebase-token:
 *   post:
 *     summary: Cập nhật firebase token cho thiết bị
 *     tags: [Action Log]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               firebase_token: 123bhkljkco23eeqưo
 *     responses:
 *       "1000":
 *         description: ok!
 */