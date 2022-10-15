const BaseJoi = require('@hapi/joi');
const Extension = require('@hapi/joi-date');

const Joi = BaseJoi.extend(Extension);

export class AuthValidator {
    static login() {
        return Joi.object().keys({
            username: Joi.string().required(),
            password: Joi.string().required(),
        })
    }

    static register() {
        return Joi.object().keys({
            username: Joi.string().max(20).required(),
            lastname: Joi.string().max(20).required(),
            firstname: Joi.string().max(20).required(),
            password: Joi.string().required(),
            email: Joi.string().email().allow(null),
            phone: Joi.string().allow(null)
                .allow(''),
            avatar_id: Joi.number().integer().allow(null),
        })
    }
}