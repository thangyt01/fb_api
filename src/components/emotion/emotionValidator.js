import { EMOTION_INSTANCE_TYPE, EMOTION_TYPE } from '../post/postConstant';

const BaseJoi = require('@hapi/joi');
const Extension = require('@hapi/joi-date');

const Joi = BaseJoi.extend(Extension);
export class EmotionValidator {
    static set() {
        return {
            instance_id: Joi.string().required(),
            type: Joi.string().valid(Object.values(EMOTION_INSTANCE_TYPE)).required(),
            emotion_type: Joi.string().valid(Object.values(EMOTION_TYPE)).required(),
        }
    }
}