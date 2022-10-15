import { respondItemSuccess, respondWithError } from "../../helpers/messageResponse";
import { COOKIE_TOKEN_KEY } from "./authConstant";
import { AuthService, setCookie } from "./authService";

const httpStatus = require('http-status')
const config = require('config')
const authConfig = config.get('auth')

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
            res.json(respondWithError(httpStatus.INTERNAL_SERVER_ERROR, error.message, error))
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
            }
            const result = await AuthService.register(params)
            if (result.success) {
                res.json(respondItemSuccess(result.data))
            } else {
                res.json(respondWithError(result.code, result.message, result.data))
            }
        } catch (error) {
            res.json(respondWithError(httpStatus.INTERNAL_SERVER_ERROR, error.message, error))
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
            res.json(respondWithError(httpStatus.INTERNAL_SERVER_ERROR, error.message, error))
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
            res.json(respondWithError(httpStatus.INTERNAL_SERVER_ERROR, error.message, error))
        }
    }
}