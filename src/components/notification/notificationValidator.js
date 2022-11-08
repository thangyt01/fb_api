import { join } from 'path'
import { EMOTION_TYPE, FILE_MEDIA_TYPE } from '../post/postConstant'
import { APP_NOTIFICATION_TYPE, NOTIFICATION_TYPE } from './notificationConstant'

const BaseJoi = require('@hapi/joi')
const Extension = require('@hapi/joi-date')

const Joi = BaseJoi.extend(Extension)

export class NotificationValidator {
    static createNotif() {
        return Joi.object().keys({
            user_id: Joi.number().required(),
            post_id: Joi.string().required(),
            type: Joi.string().valid(NOTIFICATION_TYPE).required(),
            action_user: Joi.object().keys({
                user_id: Joi.number().integer().required(),
                full_name: Joi.string().required(),
                avatar_url: Joi.string().required(),
                emotion_type: Joi.string().valid(EMOTION_TYPE).optional().allow(null),
                // Or
                // emotion_type: Joi.string().valid(['thich', 'haha']),
            })
        })
    }
    static createAppNotif() {
        return Joi.object().keys({
            user_id: Joi.number().required(),
            type: Joi.string().valid(APP_NOTIFICATION_TYPE).required(),
            action_user: Joi.object().keys({
                user_id: Joi.number().integer().required(),
                full_name: Joi.string().required(),
                avatar_url: Joi.string().required(),
                emotion_type: Joi.string().valid(EMOTION_TYPE).optional().allow(null),
                // Or
                // emotion_type: Joi.string().valid(['thich', 'haha']),
            })
        })
    }

    
}
