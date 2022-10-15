const _ = require('lodash')
const httpStatus = require('http-status')

const Logger = require('../libs/logger')
const { respondWithError } = require('../helpers/messageResponse')
const log = new Logger(__dirname)

/**
 * Thiet lap quyen truy cap route
 * @param {string|array} permisisons
 */
export function preAuthorize(permisisons) {
    return (req, res, next) => {
        req.apiRole = permisisons
        next()
    }
}

export async function authorize(req, res, next) {
    try {
        const { permissions = [], apiRole = '' } = req
        if (apiRole === 'all') {
            next()
        } else if (_.isArray(apiRole) && !!_.intersection(apiRole, permissions).length) {
            next()
        } else if (!_.isArray(apiRole) && permissions.includes(apiRole)) {
            next()
        } else {
            console.log('unauthorize....')
            log.info('authorize authorize unauthorize: ' + JSON.stringify(apiRole) + ', ' + JSON.stringify(permissions))
            res.json(respondWithError(httpStatus.FORBIDDEN, 'Forbidden'))
            return
        }
    } catch (e) {
        res.json(respondWithError(httpStatus.FORBIDDEN, 'Forbidden'))
    }
}