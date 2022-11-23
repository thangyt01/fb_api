import { HTTP_STATUS } from "../../helpers/code";
import { respondItemSuccess, respondWithError } from "../../helpers/messageResponse";
import { getListFriend, getListBlockUser } from "./userService";

const config = require('config')
const authConfig = config.get('auth')
const moment = require('moment')

export class UserController {
    static async getListFriend(req, res) {
        try {
            const params = {
                page: req.query.page ? parseInt(req.query.page) : 0,
                limit: req.query.limit ? parseInt(req.query.limit) : 20,
                loginUser: req.loginUser
            }
            const result = await getListFriend(params)
            if (result.success) {
                res.json(respondItemSuccess(result.data))
            } else {
                res.json(respondWithError(result.code, result.message, result.data))
            }
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }
    static async getListBlockUser(req, res) {
        try {
            const params = {
                page: req.query.page ? parseInt(req.query.page) || 0 : 0,
                limit: req.query.limit ? parseInt(req.query.limit) || 20 : 20,
                loginUser: req.loginUser
            }
            const result = await getListBlockUser(params)
            if (result.success) {
                res.json(respondItemSuccess(result.data))
            } else {
                res.json(respondWithError(result.code, result.message, result.data))
            }
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }
}
