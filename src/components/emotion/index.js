const express = require('express')
const { authenticate } = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const { EmotionController } = require('./emotionController')
const { EmotionValidator } = require('./emotionValidator')

module.exports = (app) => {
    const router = express.Router()
    router.post('/', authenticate, validate(EmotionValidator.set()), EmotionController.set)

    app.use('/api/emotion', router)
}

/**
 * @swagger
 * tags:
 *   name: Emotion
 *   description: API emotion
 */

/**
 * @swagger
 * /emotion/:
 *   post:
 *     summary: Set cảm xúc bài viết hoặc bình luận hoặc tin nhắn hoặc file
 *     tags: [Emotion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               instance_id: Comment mới
 *               type: 'file | post | comment | message'
 *               emotion_type: 'like | love | angry | heart_to_heart | wow | sad'
 *
 *     responses:
 *       "1000":
 *         description: ok!
 */