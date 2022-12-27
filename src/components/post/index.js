const express = require('express')
const { authenticate } = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const { PostController } = require('./postController')
const { PostValidator } = require('./postValidator')

module.exports = (app) => {
    const router = express.Router()

    // tạo bài đăng
    router.post('/', authenticate, validate(PostValidator.create()), PostController.create)
    router.get('/', authenticate, PostController.gets)
    router.get('/:id', authenticate, PostController.get)

    // sửa bài đăng
    router.put('/:id', authenticate, validate(PostValidator.edit()), PostController.edit)
    router.delete('/:id', authenticate, PostController.delete)

    app.use('/api/post', router)
}

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: API post
 */

/**
 * @swagger
 * /post/:
 *   post:
 *     summary: Đăng bài, các chế độ xem gồm public, friend, private, follower, option
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               content: Tân sinh viên, đầu tháng xông xênh, tiêu xài xả láng, cuối tháng lại ăn mỳ tôm. Có trường hợp tiêu hết 20 triệu trong tháng đầu. Không ít sinh viên dù đi ở trọ nhưng mua sắm đủ từ thảm lót chân, dây trang trí phòng, khung tranh, đèn led, đến hộp tăm, hộp đựng gia vị cùng nhiều đồ nấu nướng, giặt giũ.
 *               media_url:
 *                  - url: https://media.vov.vn/sites/default/files/styles/large/public/2021-08/man_city_vs_norwich.jpg
 *                    type: image
 *               modified_level: public
 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Chi tiết bài đăng
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *         example:
 *           6357ad737f21d0176439f038
 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /post/:
 *   get:
 *     summary: Danh sách bài đăng
 *     tags: [Post]
 *
 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: Sửa bài đăng
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *         example:
 *           6357ad737f21d0176439f038
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               content: Tân sinh viên, đầu tháng xông xênh, tiêu xài xả láng, cuối tháng lại ăn mỳ tôm. Có trường hợp tiêu hết 20 triệu trong tháng đầu. Không ít sinh viên dù đi ở trọ nhưng mua sắm đủ từ thảm lót chân, dây trang trí phòng, khung tranh, đèn led, đến hộp tăm, hộp đựng gia vị cùng nhiều đồ nấu nướng, giặt giũ.
 *               media_url:
 *                  - url: https://media.vov.vn/sites/default/files/styles/large/public/2021-08/man_city_vs_norwich.jpg
 *                    type: image
 *               modified_level: public
 *     responses:
 *       "1000":
 *         description: ok!
 */

/**
 * @swagger
 * /post/{id}:
 *   delete:
 *     summary: Xoá bài đăng (xóa mềm)
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *         example:
 *           6357ad737f21d0176439f038
 *     responses:
 *       "1000":
 *         description: ok!
 */
