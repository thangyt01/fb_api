import { hashPassword, isValidPassword } from '../../middlewares/auth'
import { userStatus } from '../user/userConstant'
import _ from 'lodash'
import * as randomToken from 'rand-token'
import { COOKIE_TOKEN_KEY, REFRESH_TOKEN_LENGTH, SECRET_ACCESS_TOKEN, SECRET_ACCESS_TOKEN_EXPIRE, SECRET_REFRESH_ACCESS_TOKEN_EXPIRE, VERIFY_TYPE } from './authConstant'
import { Op } from 'sequelize'
import { getRandomStringInt } from '../../helpers/utils/utils'
import { getMemcached, setMemcached } from '../../middlewares/memcached/service'
import { contentMail } from '../../helpers/message'

const httpStatus = require('http-status')
const jwt = require('jsonwebtoken')
const models = require('../../../database/models')
const moment = require('moment')
const mailder = require('../../middlewares/sendMail')

const config = require('config')
const authConfig = _.get(config, 'auth', null)

const Logger = require('../../libs/logger')
const log = new Logger(__dirname)

export class AuthService {
    static async login(params) {
        try {
            const { username, password } = params
            if (!(username && password)) {
                return {
                    error: true,
                    code: httpStatus.BAD_REQUEST,
                    message: 'Tên đăng nhập hoặc mật khẩu không được bỏ trống.'
                }
            }
            const user = await models.User.findOne({
                where: {
                    username: username,
                    status: userStatus.ACTIVE
                },
                raw: true
            })
            if (!user) {
                return {
                    error: true,
                    code: httpStatus.BAD_REQUEST,
                    message: 'Tên đăng nhập hoặc mật khẩu không đúng.'
                }
            }
            if (!isValidPassword(user.password, password)) {
                // return password not correct
                return {
                    error: true,
                    code: httpStatus.BAD_REQUEST,
                    message: 'Tên đăng nhập hoặc mật khẩu không đúng.'
                }
            }

            const update_user = { last_login_at: new Date() }
            const token = signToken('sign', { id: user.id, email: user.email }, { id: user.id })
            let { refresh_token, refresh_token_exp } = user
            if (!(refresh_token && refresh_token_exp && refresh_token_exp > moment().format('YYYY-MM-DD HH:mm:ss'))) {
                refresh_token = signToken('refresh')
                update_user.refresh_token = refresh_token
                update_user.refresh_token_exp = moment().add(SECRET_REFRESH_ACCESS_TOKEN_EXPIRE, 'seconds').format('YYYY-MM-DD HH:mm:ss')
            }

            let { password: uPassword, ...profile } = user
            models.User.update(update_user, {
                where: {
                    id: user.id,
                },
            })
            return {
                success: true,
                code: httpStatus.OK,
                data: {
                    profile,
                    access_token: token,
                    refresh_token: refresh_token
                }
            }
        } catch (e) {
            log.info('[login] có lỗi', e)
            return {
                error: true,
                data: [],
                message: e.stack
            }
        }
    }

    static async register(params) {
        try {
            const { username, password, phone } = params
            if (!(username && password)) {
                return {
                    error: true,
                    code: httpStatus.BAD_REQUEST,
                    message: 'Tên đăng nhập hoặc mật khẩu không được bỏ trống.'
                }
            }
            const user = await models.User.findOne({
                where: {
                    [Op.or]: [
                        {
                            username: username,
                        },
                        // {
                        //     phone: phone
                        // }
                    ],
                    status: userStatus.ACTIVE
                }
            })
            if (user) {
                return {
                    error: true,
                    code: httpStatus.BAD_REQUEST,
                    message: 'Tên đăng nhập hoặc số điện thoại đã được sử dụng.'
                }
            }
            const hashPass = hashPassword(password)
            models.User.create({
                ...params,
                password: hashPass,
                created_at: new Date(),
            });
            return {
                success: true,
                code: httpStatus.OK,
            }
        } catch (e) {
            log.info('[register] có lỗi', e)
            return {
                error: true,
                data: [],
                message: e.stack
            }
        }
    }

    static async getProfile(loginUser) {
        try {
            if (!(loginUser || loginUser.id)) {
                return {
                    error: true,
                    code: httpStatus.BAD_REQUEST,
                    message: 'Người dùng chưa đăng nhập vào hệ thống.'
                }
            }
            return {
                success: true,
                code: httpStatus.OK,
                data: loginUser
            }
        } catch (e) {
            log.info('[getProfile] có lỗi', e)
            return {
                error: true,
                data: [],
                message: e.stack
            }
        }
    }

    static async refreshToken(req) {
        try {
            if (!req.cookies || !req.cookies[COOKIE_TOKEN_KEY]) {
                return {
                    error: true,
                    code: httpStatus.BAD_REQUEST,
                    message: 'Invalid token.'
                }
            }
            const { refresh_token } = req.cookies[COOKIE_TOKEN_KEY]
            const loginUser = req.loginUser
            if (!refresh_token || !loginUser) {
                return {
                    error: true,
                    code: httpStatus.BAD_REQUEST,
                    message: 'Invalid token.'
                }
            }
            const user = await models.User.findOne({
                attributes: ['id'],
                where: {
                    id: loginUser.id,
                    status: userStatus.ACTIVE,
                    refresh_token: refresh_token,
                    refresh_token_exp: {
                        [Op.gt]: moment().format('YYYY-MM-DD HH:mm:ss')
                    }
                }
            })
            if (!user) {
                return {
                    error: true,
                    code: httpStatus.BAD_REQUEST,
                    message: 'Token expired.'
                }
            }
            const new_access_token = signToken('sign', { id: user.id, email: user.email }, { id: user.id })
            const new_refresh_token = signToken('refresh')
            models.User.update({
                refresh_token: new_refresh_token,
                refresh_token_exp: moment().add(SECRET_REFRESH_ACCESS_TOKEN_EXPIRE, 'seconds').format('YYYY-MM-DD HH:mm:ss')
            }, {
                where: {
                    id: user.id,
                },
            });
            return {
                success: true,
                code: httpStatus.OK,
                data: {
                    access_token: new_access_token,
                    refresh_token: new_refresh_token
                }
            }
        } catch (e) {
            log.info('[refreshToken] có lỗi', e)
            return {
                error: true,
                data: [],
                message: e.stack
            }
        }
    }

    static async getVerifyCode(params) {
        try {
            const { username, type } = params
            if (!username || !type) {
                return {
                    error: true,
                    code: httpStatus.BAD_REQUEST,
                    message: 'Parameters invalid.'
                }
            }
            const user = await models.User.findOne({
                attributes: ['id', 'lastname', 'status', 'email'],
                where: {
                    username: username,
                }
            })
            if (!user) {
                return {
                    error: true,
                    code: httpStatus.BAD_REQUEST,
                    message: 'username is not existed.'
                }
            }

            const code = getRandomStringInt(5)
            const mail = contentMail(type, code, user.lastname, user.email)
            await mailder.sendMail(user.email, mail.subject, mail.content)
            const key = `${VERIFY_TYPE[type]}_${user.id}`
            await setMemcached(key, code, 5 * 60 * 1000) // 5phut
            return {
                success: true,
                code: httpStatus.OK,
            }
        } catch (e) {
            log.info('[getVerifyCode] có lỗi', e)
            return {
                error: true,
                data: [],
                message: e.stack
            }
        }
    }

    static async verifyCode(params) {
        try {
            const { username, otp, type } = params
            if (!username || !otp || !type) {
                return {
                    error: true,
                    code: httpStatus.BAD_REQUEST,
                    message: 'Parameters invalid.'
                }
            }
            const user = await models.User.findOne({
                attributes: ['id', 'lastname', 'status', 'email'],
                where: {
                    username: username,
                }
            })
            if (!user) {
                return {
                    error: true,
                    code: httpStatus.BAD_REQUEST,
                    message: 'username is not existed.'
                }
            }
            const otpCache = await getMemcached(`${VERIFY_TYPE[type]}_${user.id}`)
            if (otpCache != otp) {
                return {
                    error: true,
                    code: httpStatus.BAD_REQUEST,
                    message: 'Mã xác nhận không hợp lệ.'
                }
            }
            if (type == 0) { // active account
                await models.User.update({
                    status: userStatus.ACTIVE
                }, {
                    where: {
                        id: user.id
                    }
                })
            }
            return {
                success: true,
                code: httpStatus.OK,
            }
        } catch (e) {
            log.info('[verifyCode] có lỗi', e)
            return {
                error: true,
                data: [],
                message: e.stack
            }
        }
    }

    static async changePassword(params) {
        try {
            const { oldPassword, newPassword, loginUser } = params
            if (!oldPassword || !newPassword || !loginUser) {
                return {
                    error: true,
                    code: httpStatus.BAD_REQUEST,
                    message: 'Parameters invalid.'
                }
            }
            if (!isValidPassword(loginUser.password, oldPassword)) {
                // return password not correct
                return {
                    error: true,
                    code: httpStatus.BAD_REQUEST,
                    message: 'Mật khẩu cũ không đúng.'
                }
            }

            if (isValidPassword(loginUser.password, newPassword)) {
                // return password not correct
                return {
                    error: true,
                    code: httpStatus.BAD_REQUEST,
                    message: 'Mật khẩu mới trùng với mật khẩu cũ.'
                }
            }

            //check mật khẩu là sđt

            const hashPass = hashPassword(newPassword)
            await models.User.update({
                password: hashPass,
            }, {
                where: {
                    id: loginUser.id
                }
            });

            return {
                success: true,
                code: httpStatus.OK,
            }
        } catch (e) {
            log.info('[changePassword] có lỗi', e)
            return {
                error: true,
                data: [],
                message: e.stack
            }
        }
    }

    static async changeProfile(params) {
        try {
            const { loginUser, ...data } = params
            if (!loginUser) {
                return {
                    error: true,
                    code: httpStatus.BAD_REQUEST,
                    message: 'Parameters invalid.'
                }
            }
            await models.User.update({
                ...data
            }, {
                where: {
                    id: loginUser.id
                }
            });

            return {
                success: true,
                code: httpStatus.OK,
            }
        } catch (e) {
            log.info('[changePassword] có lỗi', e)
            return {
                error: true,
                data: [],
                message: e.stack
            }
        }
    }
}

function signToken(flag, payload, condition = {}) {
    switch (flag) {
        case 'sign':
            if (authConfig
                && authConfig.secret_access_token
                && authConfig.secret_access_token_expire
                && !_.isEmpty(condition)
                && condition.id
                && condition.id < authConfig.xid
            ) {
                console.log("Sign token new config")
                return jwt.sign(payload, authConfig.secret_access_token, {
                    expiresIn: authConfig.secret_access_token_expire,
                })
            }
            console.log("Sign token old config")
            return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
                expiresIn: SECRET_ACCESS_TOKEN_EXPIRE,
            })
        case 'refresh':
            return randomToken.generate(REFRESH_TOKEN_LENGTH)
    }
}

export function setCookie(res, key, value) {
    res.cookie(key, value, { httpOnly: true })
}