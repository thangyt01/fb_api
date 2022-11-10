import axios from 'axios'
import { ACCOUNT_STATUS } from '../auth/authConstant'
import { removeRedundant } from '../../helpers/utils/utils'

const models = require('../../../database/models')
const config = require('config')
const firebaseConfig = config.get('firebase')

const Logger = require('../../libs/logger')
const log = new Logger(__dirname)

const FIREBASE_URL = firebaseConfig.url || ''
const AUTHORIZATION_KEY = firebaseConfig.key || ''


export class FirebaseService {
    /**
     *
     * @param {*} params {to, title, content}
     */
    static async sendPushOnceNotification(params) {
        try {
            const { to, title, body, text, image, data } = params
            const requestBody = {
                to: to,
                notification: {
                    title: title,
                    body: body,
                    text: text,
                    image: image
                },
                data: data
            }
            return await this.httpRequestFirebase(requestBody)
        } catch (e) {
            log.info('[updateFirebaseToken] có lỗi', e)
            throw e
        }
    }

    /**
     *
     * @param {*} params {to<Array[]>, title, content}
     */
    static async sendPushMultipleNotification(params) {
        try {
            const { to = [], title, body, text, image, data } = params
            const requestBody = {
                registration_ids: to,
                notification: {
                    title: title,
                    body: body,
                    text: text,
                    image: image
                },
                data: data
            }
            return await this.httpRequestFirebase(requestBody)
        } catch (e) {
            log.info('[updateFirebaseToken] có lỗi', e)
            throw e
        }
    }

    static async httpRequestFirebase(body) {
        try {
            removeRedundant(body.notification)
            const res = await axios.post(FIREBASE_URL, body, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: AUTHORIZATION_KEY
                }
            })
            return res.data
        } catch (e) {
            log.info('[httpRequestFirebase] có lỗi', e)
            throw e
        }
    }

    static async getFirebaseTokenFromUserIds(userIds, option = {}) {
        try {
            const includeWhere = {
                user_id: userIds
            }
            if (option.status && Object.values(ACCOUNT_STATUS).includes(option.status)) {
                includeWhere.status = option.status
            }
            const fbTokens = await models.CoreDevice.findAll({
                attributes: ['id', 'device_id', 'firebase_token'],
                include: [
                    {
                        model: models.CoreUserDevice,
                        attributes: ['id', 'user_id', 'status', 'last_login_at'],
                        as: 'user_device',
                        where: includeWhere
                    }
                ],
                raw: true
            })
            return fbTokens
        } catch (e) {
            log.info('[getFirebaseTokenFromUserIds] có lỗi', e)
            throw e
        }
    }
}