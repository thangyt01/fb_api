import _ from 'lodash'
import { userStatus } from '../components/user/userConstant'
import { respondWithError } from '../helpers/messageResponse'
import { COOKIE_TOKEN_KEY } from '../components/auth/authConstant'

const jwt = require('jsonwebtoken')
const models = require('../../database/models')
const httpStatus = require('http-status')

const {
    SECRET_ACCESS_TOKEN,
    SECRET_REFRESH_ACCESS_TOKEN,
} = require('../components/auth/authConstant')

const config = require('config')
const authConfig = _.get(config, 'auth', null)

const bCrypt = require('bcryptjs')

export function isValidPassword(userpass, password) {
    return bCrypt.compareSync(password, userpass)
}
export function hashPassword(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null)
}

export function extractToken(req) {
    // cookie token priority headers token
    if (req.cookies && req.cookies[COOKIE_TOKEN_KEY]) {
        return req.cookies[COOKIE_TOKEN_KEY].access_token
    }
    let authorization = req.headers?.authorization || ''
    const bearerHeader = authorization.split(' ')
    if (bearerHeader.length === 2 && bearerHeader[0] === 'Bearer') {
        return bearerHeader[1]
    }
    return ''
}

export function verifyToken(token, type) {
    if (authConfig
        && authConfig.secret_refresh_access_token
        && authConfig.secret_access_token
        && authConfig.xid) {
        const { id } = jwt.decode(token)
        if (id && id < authConfig.xid) {
            return type === 'refresh' ? jwt.verify(token, authConfig.secret_refresh_access_token)
                : jwt.verify(token, authConfig.secret_access_token)
        }
    }
    console.log("Verify token old config")
    return type === 'refresh' ? jwt.verify(token, SECRET_REFRESH_ACCESS_TOKEN)
        : jwt.verify(token, SECRET_ACCESS_TOKEN)
}

export async function authenticate(req, res, next) {
    try {
        const token = extractToken(req || '')
        const decodedToken = verifyToken(token, req.authorization_type)
        const { id } = decodedToken
        const user = await models.User.findOne({
            include: [
                {
                    model: models.Role,
                    through: models.UserRole,
                    as: 'role',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: models.RolePermission,
                            as: 'permissions',
                            attributes: ['id', 'model', 'action'],
                        }
                    ]
                }
            ],
            attributes: ['id', 'username', 'email', 'firstname', 'lastname', 'birthday',
                'gender', 'phone', 'status', 'last_login_at', 'created_at', 'updated_at'],
            where: {
                id: id
            },
        })
        if (user) {
            if (user.status === userStatus.ACTIVE) {
                req.loginUser = user
                req.loginUser.token = token
                req.permissions = _.get(user, 'role', []).reduce((list, role) => {
                    const permissions = _.get(role, 'permissions', []).map(p => (`${_.get(p, 'model')}_${_.get(p, 'action')}`))
                    return [...list, ...permissions]
                }, [])
                next()
            } else {
                res.json(respondWithError(httpStatus.FORBIDDEN, 'Unauthorized'))
            }
        } else {
            res.json(respondWithError(httpStatus.FORBIDDEN, 'Token Expired'))
        }
    } catch (e) {
        if (_.get(e, 'name', '') === 'TokenExpiredError') {
            res.json(respondWithError(httpStatus.FORBIDDEN, 'Token Expired'))
            return
        }
        res.json(respondWithError(httpStatus.UNAUTHORIZED, 'Unauthorized'))
    }
}
