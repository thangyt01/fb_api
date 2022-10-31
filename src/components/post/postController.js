import { HTTP_STATUS } from '../../helpers/code'
import { respondItemSuccess, respondWithError } from '../../helpers/messageResponse'
import { PostService } from './postService'

export class PostController {
    static async create(req, res) {
        try {
            const params = {
                content: req.body ? req.body.content : null,
                media_url: req.body ? req.body.media_url : null,
                modified_level: req.body ? req.body.modified_level : null,
                loginUser: req.loginUser
            }
            const result = await PostService.create(params)
            if (result.success) {
                res.json(respondItemSuccess(result.data))
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
                post_id: req.params ? req.params.id : null,
                content: req.body ? req.body.content : null,
                media_url: req.body ? req.body.media_url : null,
                modified_level: req.body ? req.body.modified_level : null,
                loginUser: req.loginUser
            }
            const result = await PostService.edit(params)
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
                post_id: req.params ? req.params.id : null,
                loginUser: req.loginUser
            }
            const result = await PostService.delete(params)
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
                post_id: req.params ? req.params.id : null,
                loginUser: req.loginUser
            }
            const result = await PostService.get(params)
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
