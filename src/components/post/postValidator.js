const BaseJoi = require('@hapi/joi')
const Extension = require('@hapi/joi-date')

const Joi = BaseJoi.extend(Extension)
const { MODIFIED_LEVEL, FILE_MEDIA_TYPE } = require('./postConstant')

export class PostValidator {
    static create() {
        return Joi.object().keys({
            content: Joi.string().required(),
            media_url: Joi.array().items(Joi.object().keys({
                url: Joi.string().required(),
                type: Joi.string().valid(Object.values(FILE_MEDIA_TYPE)).allow(null)
            })).allow(null),
            modified_level: Joi.string().valid(Object.values(MODIFIED_LEVEL)).allow(null),
        })
    }
}