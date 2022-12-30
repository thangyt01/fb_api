const express = require('express')
const { authenAppToken, authenticate } = require('../../middlewares/auth')
const { uploadFiles } = require('../../middlewares/upload')
const validate = require('../../middlewares/validate')
const { ActionLogController } = require('./actionLogController')
const { ActionLogValidator } = require('./actionLogValidator')
const multer = require('multer')
const fileUpload = multer()
const config = require('config')

const MAX_FILE = config.get('cloudinary').max_file_upload || 10

module.exports = (app) => {
    const router = express.Router()
    router.post('/firebase-token', authenAppToken, validate(ActionLogValidator.firebaseToken()), ActionLogController.updateFirebaseToken)
    router.post('/upload', authenticate, fileUpload.array('file', MAX_FILE), uploadFiles)
    router.get('/migrate/elastic-search', authenticate, ActionLogController.migrateUsersDbToElasticSearch)
    router.get('/factory/create-user', authenticate, ActionLogController.factoryCreateUsers)

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

/**
 * @swagger
 * /action/upload:
 *   post:
 *     summary: Upload files, tối đa 5 file cùng lúc
 *     tags: [Action Log]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: array
 *                 items:
 *                   type: file
 *
 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /action/migrate/elastic-search:
 *   get:
 *     summary: Migrate bảng users sang elasticsearch
 *     tags: [Action Log]

 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /action/factory/create-user:
 *   get:
 *     summary: Tạo tự động user
 *     tags: [Action Log]
 *     parameters:
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: string
 *         description: quantity
 *         example:
 *           10

 *     responses:
 *       "1000":
 *         description: ok!
 */