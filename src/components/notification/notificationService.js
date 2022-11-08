import moment from 'moment'
import mongoose from 'mongoose'
import Post from '../../../database/mongoDb/model/Post'
import { HTTP_STATUS } from '../../helpers/code'

const { Notification, AppNotification } = require('../../../database/mongoDb/model/Notification')
const Logger = require('../../libs/logger')
const log = new Logger(__dirname)

export class NotificationService {
    static async createNotif(params) {
        try {
            const { post_id, user_id, type, action_user, loginUser } = params

            const data = {
                post_id,
                user_id,
                type,
                action_user,
                created_by: {
                    user_id: loginUser.id,
                    full_name: loginUser.firstname + ' ' + loginUser.lastname,
                    avatar_url: loginUser.avatar_url
                }
            }
            await Notification.create(data)

            return {
                success: true,
                code: HTTP_STATUS[1000].code,
                message: HTTP_STATUS[1000].message
            }
        } catch (e) {
            log.info('[create] có lỗi', e)
            return {
                error: true,
                data: [],
                message: e.stack
            }
        }
    }
    static async createAppNotif(params) {
        try {
            const { user_id, type, action_user, loginUser } = params

            const data = {
                user_id,
                type,
                action_user,
                created_by: {
                    user_id: loginUser.id,
                    full_name: loginUser.firstname + ' ' + loginUser.lastname,
                    avatar_url: loginUser.avatar_url
                }
            }
            await AppNotification.create(data)

            return {
                success: true,
                code: HTTP_STATUS[1000].code,
                message: HTTP_STATUS[1000].message
            }
        } catch (e) {
            log.info('[create] có lỗi', e)
            return {
                error: true,
                data: [],
                message: e.stack
            }
        }
    }

    static async getNotifications(params){
        try {
            const { page, limit, loginUser } = params
            let notifResult = await Notification
                .find({
                    deleted_at : null
                })
                .sort({ created_at: -1 })
                .limit(limit)
                .skip(page * limit)
                .exec()

            let appNotifResult = await AppNotification
                .find({
                    deleted_at : null
                })
                .sort({ created_at: -1 })
                .limit(limit)
                .skip(page * limit)
                .exec()

            return {
                success: true,
                code: HTTP_STATUS[1000].code,
                message: HTTP_STATUS[1000].message,
                data: [...appNotifResult, ...notifResult].sort((a, b)=> a > b ? -1 : 1)
            }
        } catch (e) {
            log.info('[create] có lỗi', e)
            return {
                error: true,
                data: [],
                message: e.stack
            }
        }
    }

}
