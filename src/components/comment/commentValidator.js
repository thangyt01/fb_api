import { FILE_MEDIA_TYPE } from '../post/postConstant'

const BaseJoi = require('@hapi/joi')
const Extension = require('@hapi/joi-date')

const Joi = BaseJoi.extend(Extension)

export class CommentValidator {
    static create() {
        return Joi.object().keys({
            content: Joi.string().required(),
            media_url: Joi.object().keys({
                url: Joi.string().required(),
                type: Joi.string().valid(Object.values(FILE_MEDIA_TYPE)).allow(null)
            }).allow(null),
            reply_id: Joi.string().allow(null),
        })
    }

    static edit() {
        return Joi.object().keys({
            content: Joi.string().allow(null),
            media_url: Joi.array().items(Joi.object().keys({
                url: Joi.string().required(),
                type: Joi.string().valid(Object.values(FILE_MEDIA_TYPE)).allow(null)
            })).allow(null),
        })
    }
}