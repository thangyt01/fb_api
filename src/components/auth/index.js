const express = require('express')
const { authenticate } = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const { AuthController } = require('./authController')
const { AuthValidator } = require('./authValidator')

module.exports = (app) => {
    const router = express.Router()

    router.post('/login', validate(AuthValidator.login()), AuthController.login)
    router.post('/register', validate(AuthValidator.register()), AuthController.register)
    router.get('/profile', authenticate, AuthController.getProfile)
    router.post('/refresh-token', authenticate, AuthController.refreshToken)
    // router.post('/profile', authenticate, profileValidator, updateProfile)
    // router.post('/profile/change-password', authenticate, passwordValidator, changePassword)
    app.use('/api', router)
}

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: At least one number and one letter
 *             example:
 *               username: admin
 *               password: admin
 *     responses:
 *       "201":
 *         description: Login successfully!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   $ref: '#/components/schemas/User'
 *                 access_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0aGFuZ3l0MDBAZ21haWwuY29tIiwiaWF0IjoxNjY1NDU3NTAyLCJleHAiOjE2NjY3NTM1MDJ9.JURaM56dpbHWU8_WSU-lkd8YmDs-UNqQv9stgZyB15Y
 *                 refresh_token: sDv94PcxcgNf36fz
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */
