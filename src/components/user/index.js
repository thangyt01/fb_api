const express = require('express')
const { authenticate } = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const { UserController } = require('./userController')

module.exports = (app) => {
    const router = express.Router()
    console.log("Lkerge")
    router.get('/list-friend', authenticate, UserController.getListFriend)
    router.get('/list-block-user', authenticate, UserController.getListBlockUser)


    app.use('/api', router)
}
