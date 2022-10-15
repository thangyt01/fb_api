const httpStatus = require('http-status')

const env = require('../configs/env')
const Logger = require('../libs/logger')
const { respondWithError } = require('../helpers/messageResponse')
const logger = new Logger(__dirname)


const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err

    if (env.isProduction && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
    }

    const response = {
        code: statusCode,
        message,
        ...(env.isDevelopment && { stack: err.stack }),
    }

    if (env.isDevelopment) logger.error(err)

    return res.json(respondWithError(response.code, response.message, response.stack))
}

const errorLoader = (app) => {
    // handle error
    // app.use(errorHandler)

    // 404 error
    app.use((req, res) => {
        let api = {
            ip: req.headers['x-forwarded-for'],
            url: req.url,
            params: req.params,
            query: req.query,
            body: req.body
        }
        logger.info(`app ApiNotFound ${JSON.stringify(api)}`, 'logs_api_response')
        res.json(respondWithError(httpStatus.NOT_FOUND, 'API not found'))
    })

    // 500 error
    app.use((err, req, res) => {
        res.json(respondWithError(httpStatus.INTERNAL_SERVER_ERROR, `System error: ${err.message}`, err))
    })
}

module.exports = {
    errorHandler,
    errorLoader
}
