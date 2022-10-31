const env = require('../configs/env')
const Logger = require('../libs/logger')
const { respondWithError } = require('../helpers/messageResponse')
const { HTTP_STATUS } = require('../helpers/code')
const logger = new Logger(__dirname)


const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err

    if (env.isProduction && !err.isOperational) {
        statusCode = HTTP_STATUS[1013].code
        message = HTTP_STATUS[1013].message
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
        res.json(respondWithError(HTTP_STATUS[1005].code, 'API not found'))
    })

    // 500 error
    app.use((err, req, res) => {
        res.json(respondWithError(HTTP_STATUS[1013].code, `System error: ${err.message}`, err))
    })
}

module.exports = {
    errorHandler,
    errorLoader
}
