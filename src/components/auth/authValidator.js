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
            username: Joi.string().max(20).required(),
            lastname: Joi.string().max(20).required(),
            firstname: Joi.string().max(20).required(),
            password: Joi.string().required(),
            email: Joi.string().email().allow(null),
            phone: Joi.string().allow(null)
                .allow(''),
            avatar_id: Joi.number().integer().allow(null),
            gender: Joi.string().valid(['male', 'female', 'other']).allow(null),
            birthday: Joi.date().format('YYYY-MM-DD')
                .max(moment().subtract(15, 'years').format('YYYY-MM-DD'))
                .error(new Error('Ngày sinh phải trên 15 tuổi.'))
                .allow(null)
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
            lastname: Joi.string().max(20).allow(null),
            firstname: Joi.string().max(20).allow(null),
            gender: Joi.string().valid(['male', 'female', 'other']).allow(null),
            birthday: Joi.date().format('YYYY-MM-DD')
                .max(moment().subtract(15, 'years').format('YYYY-MM-DD'))
                .error(new Error('Ngày sinh phải trên 15 tuổi.'))
                .allow(null)
        })
    }
}