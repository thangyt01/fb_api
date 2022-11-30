import { HTTP_STATUS } from "../../helpers/code";
import { respondArraySuccess, respondItemSuccess, respondWithError } from "../../helpers/messageResponse";
import { ChatService } from "./chatService";

export class ChatController {
    static async create(req, res) {
        try {
            const params = {
                group_chat_id: req.body ? req.body.group_chat_id : null,
                content: req.body ? req.body.content : null,
                reply_id: req.body ? req.body.reply_id : null,
                media_url: req.body ? req.body.media_url : null,
                loginUser: req.loginUser,
            }
            const result = await ChatService.create(params)
            if (result.success) {
                res.json(respondItemSuccess(result.data))
            } else {
                res.json(respondWithError(result.code, result.message, result.data))
            }
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }

    static async get(req, res) {
        try {
            const params = {
                receive_id: +req.params.userId || null,
                limit: +req.query.limit || 20,
                page: +req.query.page || 0,
                loginUser: req.loginUser,
            }
            const result = await ChatService.get(params)
            if (result.success) {
                res.json(respondArraySuccess(result.data, result.total))
            } else {
                res.json(respondWithError(result.code, result.message, result.data))
            }
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }

    static async getGroupChat(req, res) {
        try {
            const params = {
                groupChatId: req.params.groupChatId || null,
                limit: +req.query.limit || 20,
                page: +req.query.page || 0,
                loginUser: req.loginUser,
            }
            const result = await ChatService.getGroupChat(params)
            if (result.success) {
                res.json(respondArraySuccess(result.data, result.total))
            } else {
                res.json(respondWithError(result.code, result.message, result.data))
            }
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }
}