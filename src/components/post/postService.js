import { HTTP_STATUS } from '../../helpers/code'
import { MODIFIED_LEVEL } from './postConstant'

const Post = require('../../../database/mongoDb/model/Post')
const Logger = require('../../libs/logger')
const log = new Logger(__dirname)

export class PostService {
    static async create(params) {
        try {
            const { content, media_url = [], modified_level = MODIFIED_LEVEL.PUBLIC, loginUser } = params
            const post = new Post({
                content,
                media_url,
                modified_level,
                created_by: {
                    user_id: loginUser.id,
                    full_name: loginUser.firstname + ' ' + loginUser.lastname,
                    avatar_url: loginUser.avatar_url
                }
            })
            await post.save()
            return {
                success: true,
                code: HTTP_STATUS[1000].code,
                message: HTTP_STATUS[1000].message
            }
        } catch (error) {
            log.info('[create] có lỗi', e)
            return {
                error: true,
                data: [],
                message: e.stack
            }
        }
    }
}
