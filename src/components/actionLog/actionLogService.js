import { HTTP_STATUS } from '../../helpers/code'

const models = require('../../../database/models')

const Logger = require('../../libs/logger')
const log = new Logger(__dirname)

export class ActionLogService {
    static async updateFirebaseToken(params) {
        try {
            const { userId, deviceId, firebaseToken } = params
            if (!userId || !deviceId || !firebaseToken) {
                return {
                    error: true,
                    code: HTTP_STATUS[1004].code,
                    message: HTTP_STATUS[1004].message
                }
            }
            const device = await models.CoreDevice.findOne({
                where: {
                    device_id: deviceId
                }
            })
            if (!device) {
                return {
                    error: true,
                    code: HTTP_STATUS[1004].code,
                    message: HTTP_STATUS[1004].message
                }
            }
            if (device.firebase_token != firebaseToken) {
                await models.CoreDevice.update({
                    firebase_token: firebaseToken,
                    updated_by: userId,
                    updated_at: new Date()
                }, {
                    where: {
                        id: device.id
                    }
                })
            }
        } catch (e) {
            log.info('[updateFirebaseToken] có lỗi', e)
            return {
                error: true,
                data: [],
                message: e.stack
            }
        }
    }
}