import { RELATIONSHIP_TYPE, VERIFY_TYPE } from './authConstant';

const moment = require('moment')
const BaseJoi = require('@hapi/joi');
const Extension = require('@hapi/joi-date');

const Joi = BaseJoi.extend(Extension);

const verifyType = Object.keys(VERIFY_TYPE)
export class AuthValidator {
    static login() {
        return Joi.object().keys({
            username: Joi.string().required(),
            password: Joi.string().required(),
            device_id: Joi.string().allow(null).allow('')
        })
    }

    static register() {
        return Joi.object().keys({
            username: Joi.string().regex(/^[a-z0-9_-]{4,20}$/).required(),
            lastname: Joi.string().max(20).required(),
            firstname: Joi.string().max(20).required(),
            password: Joi.string().min(5).required(),
            email: Joi.string().email().required(),
            phone: Joi.string().regex(/^[0-9]{10}$/).optional(),
            address: Joi.string().optional(),
            link_github: Joi.string().allow(null).allow(''),
            link_twitter: Joi.string().allow(null).allow(''),
            avatar_id: Joi.number().integer().allow(null).optional(),
            gender: Joi.string().valid(['male', 'female', 'other']).allow(null).optional(),
            birthday: Joi.date().format('YYYY-MM-DD')
                .max(moment().subtract(15, 'years').format('YYYY-MM-DD'))
                .error(new Error('Ngày sinh phải trên 15 tuổi.'))
                .allow(null).optional()
        })
    }

    static getVerifyCode() {
        return Joi.object().keys({
            username: Joi.string().max(20).required(),
            type: Joi.string().valid(verifyType).required()
        })
    }

    static verifyCode() {
        return Joi.object().keys({
            username: Joi.string().max(20).required(),
            type: Joi.string().valid(verifyType).required(),
            otp: Joi.number().required()
        })
    }

    static changePassword() {
        return Joi.object().keys({
            old_password: Joi.string().required(),
            new_password: Joi.string().required()
        })
    }

    static changeProfile() {
        return Joi.object().keys({
            lastname: Joi.string().max(20).allow(null),
            firstname: Joi.string().max(20).allow(null),
            link_github: Joi.string().allow(null).allow(''),
            link_twitter: Joi.string().allow(null).allow(''),
            address: Joi.string().allow(null).allow(''),
            gender: Joi.string().valid(['male', 'female', 'other']).allow(null),
            birthday: Joi.date().format('YYYY-MM-DD')
                .max(moment().subtract(15, 'years').format('YYYY-MM-DD'))
                .error(new Error('Ngày sinh phải trên 15 tuổi.'))
                .allow(null)
        })
    }

    static changeAvatar() {
        return Joi.object().keys({
            avatar_id: Joi.string().required()
        })
    }

    static changeFriendRelationShip() {
        return Joi.object().keys({
            user_id: Joi.number().integer().required(),
            type: Joi.string().valid(Object.values(RELATIONSHIP_TYPE)).required()
        })
    }
}
