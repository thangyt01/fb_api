import { HTTP_STATUS } from "../../helpers/code";
import { respondItemSuccess, respondWithError } from "../../helpers/messageResponse";
import { COOKIE_TOKEN_KEY } from "./authConstant";
import { AuthService, setCookie } from "./authService";

const config = require('config')
const authConfig = config.get('auth')
const moment = require('moment')

export class AuthController {
    static async login(req, res) {
        try {
            const params = {
                username: req.body ? req.body.username : null,
                password: req.body ? req.body.password : null
            }
            const result = await AuthService.login(params)
            if (result.success) {
                const { access_token, refresh_token } = result.data
                if (authConfig.set_cookie) {
                    setCookie(res, COOKIE_TOKEN_KEY, { access_token, refresh_token })
                }
                res.json(respondItemSuccess(result.data))
            } else {
                res.json(respondWithError(result.code, result.message, result.data))
            }
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }

    static async register(req, res) {
        try {
            const params = {
                username: req.body ? req.body.username : null,
                lastname: req.body ? req.body.lastname : null,
                firstname: req.body ? req.body.firstname : null,
                password: req.body ? req.body.password : null,
                email: req.body ? req.body.email : null,
                phone: req.body ? req.body.phone : null,
                avatar_id: req.body ? req.body.avatar_id : null,
                gender: req.body ? req.body.gender : null,
                birthday: req.body?.birthday ? moment(req.body.birthday).format('YYYY-MM-DD HH:mm:ss') : null
            }
            const result = await AuthService.register(params)
            if (result.success) {
                res.json(respondItemSuccess(result.data))
            } else {
                res.json(respondWithError(result.code, result.message, result.data))
            }
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }

    static async getProfile(req, res) {
        try {
            const result = await AuthService.getProfile(req.loginUser)
            if (result.success) {
                res.json(respondItemSuccess(result.data))
            } else {
                res.json(respondWithError(result.code, result.message, result.data))
            }
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }

    static async refreshToken(req, res) {
        try {
            const result = await AuthService.refreshToken(req)
            if (result.success) {
                const { access_token, refresh_token } = result.data
                if (authConfig.set_cookie) {
                    setCookie(res, COOKIE_TOKEN_KEY, { access_token, refresh_token })
                }
                res.json(respondItemSuccess(result.data))
            } else {
                res.json(respondWithError(result.code, result.message, result.data))
            }
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }

    static async getVerifyCode(req, res) {
        try {
            const params = {
                username: req.body ? req.body.username : null,
                type: req.body ? req.body.type : null
            }
            const result = await AuthService.getVerifyCode(params)
            if (result.success) {
                res.json(respondItemSuccess(result.data))
            } else {
                res.json(respondWithError(result.code, result.message, result.data))
            }
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }

    static async verifyCode(req, res) {
        try {
            const params = {
                username: req.body ? req.body.username : null,
                type: req.body ? req.body.type : null,
                otp: req.body ? req.body.otp : null
            }
            const result = await AuthService.verifyCode(params)
            if (result.success) {
                res.json(respondItemSuccess(result.data))
            } else {
                res.json(respondWithError(result.code, result.message, result.data))
            }
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }

    static async logout(req, res) {
        try {
            res.clearCookie(COOKIE_TOKEN_KEY)
            res.json(respondItemSuccess())
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }

    static async changePassword(req, res) {
        try {
            const params = {
                oldPassword: req.body ? req.body.old_password : null,
                newPassword: req.body ? req.body.new_password : null,
                loginUser: req.loginUser || null
            }
            const result = await AuthService.changePassword(params)
            if (result.success) {
                res.json(respondItemSuccess(result.data))
            } else {
                res.json(respondWithError(result.code, result.message, result.data))
            }
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }

    static async changeProfile(req, res) {
        try {
            const params = {
                lastname: req.body ? req.body.lastname : null,
                firstname: req.body ? req.body.firstname : null,
                gender: req.body ? req.body.gender : null,
                birthday: req.body && req.body.birthday ? moment(req.body.birthday).format('YYYY-MM-DD HH:mm:ss') : null,
                loginUser: req.loginUser || null
            }
            const result = await AuthService.changeProfile(params)
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
