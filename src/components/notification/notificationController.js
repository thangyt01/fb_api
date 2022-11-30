import { HTTP_STATUS } from '../../helpers/code'
import { respondArraySuccess, respondItemSuccess, respondWithError } from '../../helpers/messageResponse'
import { NotificationService } from './notificationService'

export class NotificationController {
    static async createNotif(req, res) {
        try {
            const params = {
                user_id: req.body ? req.body.user_id : null,
                post_id: req.body ? req.body.post_id : null,
                type: req.body ? req.body.type : null,
                action_user: req.body ? req.body.action_user : null,
                loginUser: req.loginUser
            }
            const result = await NotificationService.createNotif(params)
            if (result.success) {
                res.json(respondItemSuccess(result.data))
            } else {
                res.json(respondWithError(result.code, result.message, result.data))
            }
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }

    static async createAppNotif(req, res) {
        try {
            const params = {
                user_id: req.body ? req.body.user_id : null,
                type: req.body ? req.body.type : null,
                action_user: req.body ? req.body.action_user : null,
                loginUser: req.loginUser
            }
            const result = await NotificationService.createAppNotif(params)
            if (result.success) {
                res.json(respondItemSuccess(result.data))
            } else {
                res.json(respondWithError(result.code, result.message, result.data))
            }
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }

    static async getNotifications(req, res) {
        try {
            const params = {
                page: req.query ? parseInt(req.query.page) : 0,
                limit: req.query ? parseInt(req.query.limit) : 10,
                loginUser: req.loginUser
            }
            const result = await NotificationService.getNotifications(params)
            if (result.success) {
                res.json(respondItemSuccess(result.data))
            } else {
                res.json(respondWithError(result.code, result.message, result.data))
            }
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }

    static async updateNotification(req, res) {
        try {
            const params = {
                page: req.query ? parseInt(req.query.page) : 0,
                limit: req.query ? parseInt(req.query.limit) : 10,
                loginUser: req.loginUser
            }
            const result = await NotificationService.getNotifications(params)
            if (result.success) {
                res.json(respondItemSuccess(result.data))
            } else {
                res.json(respondWithError(result.code, result.message, result.data))
            }
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }

}
