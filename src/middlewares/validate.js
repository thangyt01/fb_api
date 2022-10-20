const BaseJoi = require('@hapi/joi');
const Extension = require('@hapi/joi-date');
const { HTTP_STATUS } = require('../helpers/code');

const Joi = BaseJoi.extend(Extension);

const { respondWithError } = require('../helpers/messageResponse')

module.exports = (schema) => (req, res, next) => {
    const { value, error } = Joi.validate(req.body, schema, { abortEarly: false })

    if (error) {
        let errorMessage
        if (error?.details) {
            errorMessage = error.details.map((details) => details.message).join(', ')
        } else {
            errorMessage = error.message
        }
        res.json(respondWithError(HTTP_STATUS[9999].code, errorMessage))
        return;
    }
    Object.assign(req, value)
    return next()
}
