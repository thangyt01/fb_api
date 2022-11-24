const express = require('express')
const { authenticate, authenAppToken } = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const { AuthController } = require('./authController')
const { AuthValidator } = require('./authValidator')

module.exports = (app) => {
    const router = express.Router()

    router.post('/login', validate(AuthValidator.login()), AuthController.login)
    router.post('/register', validate(AuthValidator.register()), AuthController.register)
    router.get('/profile', authenticate, AuthController.getProfile)
    router.post('/refresh-token', authenticate, AuthController.refreshToken)
    router.get('/health-check', (req, res) => {
        res.json('server is running!!!')
    })
    router.post('/get-verify-code', validate(AuthValidator.getVerifyCode()), AuthController.getVerifyCode)
    router.post('/verify-code', validate(AuthValidator.verifyCode()), AuthController.verifyCode)
    router.get('/logout', authenAppToken, AuthController.logout)
    router.post('/profile', authenticate, validate(AuthValidator.changeProfile()), AuthController.changeProfile)
    router.post('/profile/change-password', authenticate, validate(AuthValidator.changePassword()), AuthController.changePassword)
    router.post('/profile/change-avatar', authenticate, validate(AuthValidator.changeAvatar()), AuthController.changePassword)
    router.post('/update-relationship',  validate(AuthValidator.changeFriendRelationShip()), AuthController.changeFriendRelationShip)


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
 *     summary: Đăng nhập
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
 *                 minLength: 5
 *                 description: At least one number and one letter
 *             example:
 *               username: admin
 *               password: admin
 *               device_id: 1234
 *     responses:
 *       "1000":
 *         description: Login successfully!
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Đăng ký
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               username: bks2022
 *               password: bks2022
 *               email: bks2022@gmail.com
 *               firstname: bach
 *               lastname: khoa
 *               phone: "0372010912"
 *               gender: male
 *               birthday: 2001-01-01
 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Chi tiết profile
 *     tags: [Auth]
 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Refresh token
 *     tags: [Auth]
 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /health-check:
 *   get:
 *     summary: Health check server
 *     tags: [Auth]
 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /get-verify-code:
 *   post:
 *     summary: Lấy mã xác thực, type "0" là kích hoạt tài khoản, "1" là quên mật khẩu
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               username: admin
 *               type: "0"
 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /verify-code:
 *   post:
 *     summary: Verify mã xác thực
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               username: admin
 *               type: "0"
 *               otp: 74161
 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Đăng xuất
 *     tags: [Auth]
 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /profile:
 *   post:
 *     summary: Thay đổi thông tin cá nhân
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               firstname: Đặng Xuân
 *               lastname: Thắng
 *               gender: male
 *               birthday: 2001-01-01
 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /profile/change-password:
 *   post:
 *     summary: Đổi mật khẩu
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               old_password: bks2022
 *               new_password: bks2023
 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /profile/change-avatar:
 *   post:
 *     summary: Đổi ảnh đại diện
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               avatar_id: 63536d2fde80401beccdb42f
 *     responses:
 *       "1000":
 *         description: ok!
 */
