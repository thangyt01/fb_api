import { HTTP_STATUS } from '../../helpers/code'
import { respondArraySuccess, respondItemSuccess, respondWithError } from '../../helpers/messageResponse'

export class CommentController {
    static async create(req, res) {
        try {
            const params = {
                post_id: req.params ? req.params.postId : null,
                content: req.body ? req.body.content : null,
                media_url: req.body ? req.body.media_url : null,
                reply_id: req.body ? req.body.reply_id : null,
                loginUser: req.loginUser
            }
            const result = await CommentService.create(params)
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
                post_id: req.params ? req.params.postId : null,
                reply_id: req.query ? req.query.reply_id : null,
                limit: req.query.limit ? +req.query.limit : 10,
                page: req.query.page ? +req.query.page : 0,
                loginUser: req.loginUser
            }
            const result = await CommentService.get(params)
            if (result.success) {
                res.json(respondArraySuccess(result.data, result.total))
            } else {
                res.json(respondWithError(result.code, result.message, result.data))
            }
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }

    static async edit(req, res) {
        try {
            const params = {
                comment_id: req.params ? req.params.commentId : null,
                content: req.body ? req.body.content : null,
                media_url: req.body ? req.body.media_url : null,
                loginUser: req.loginUser
            }
            const result = await CommentService.edit(params)
            if (result.success) {
                res.json(respondItemSuccess(result.data))
            } else {
                res.json(respondWithError(result.code, result.message, result.data))
            }
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }

    static async delete(req, res) {
        try {
            const params = {
                comment_id: req.params ? req.params.commentId : null,
                loginUser: req.loginUser
            }
            const result = await CommentService.delete(params)
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
