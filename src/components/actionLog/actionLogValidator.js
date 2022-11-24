const BaseJoi = require('@hapi/joi');
const Extension = require('@hapi/joi-date');

const Joi = BaseJoi.extend(Extension);
export class ActionLogValidator {
    static firebaseToken() {
        return {
            firebase_token: Joi.string().allow(null).allow('').error(new Error('Firebase token không hợp lệ.'))
        }
    }
}