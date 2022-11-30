import { FILE_MEDIA_TYPE } from "../post/postConstant";

const BaseJoi = require('@hapi/joi')
const Extension = require('@hapi/joi-date')

const Joi = BaseJoi.extend(Extension)

export class ChatValidator {
    static create(req, res) {
        return Joi.object().keys({
            group_chat_id: Joi.string().allow(null).optional(),
            content: Joi.string().max(255).allow(null).allow(''),
            reply_id: Joi.string().allow(null),
            media_url: Joi.object().keys({
                url: Joi.string().required(),
                type: Joi.string().valid(Object.values(FILE_MEDIA_TYPE)).required()
            }).allow(null),
        })
    }
}