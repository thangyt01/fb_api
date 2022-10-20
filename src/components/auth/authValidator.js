import { VERIFY_TYPE } from './authConstant';

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
        })
    }

    static register() {
        return Joi.object().keys({
            username: Joi.string().regex(/^[a-z0-9_-]{4,20}$/).required(),
            lastname: Joi.string().max(20).alphanum().required(),
            firstname: Joi.string().max(20).alphanum().required(),
            password: Joi.string().min(5).required(),
            email: Joi.string().email().required(),
            phone: Joi.string().regex(/^[0-9]{10}$/).optional(),
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
            otp: Joi.string().required()
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
            lastname: Joi.string().max(20).alphanum().allow(null),
            firstname: Joi.string().max(20).alphanum().allow(null),
            gender: Joi.string().valid(['male', 'female', 'other']).allow(null),
            birthday: Joi.date().format('YYYY-MM-DD')
                .max(moment().subtract(15, 'years').format('YYYY-MM-DD'))
                .error(new Error('Ngày sinh phải trên 15 tuổi.'))
                .allow(null)
        })
    }
}
