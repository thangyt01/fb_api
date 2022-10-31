import moment from 'moment'
import mongoose from 'mongoose'
import PostComment from '../../../database/mongoDb/model/PostComment'
import { HTTP_STATUS } from '../../helpers/code'
import { removeRedundant } from '../../helpers/utils/utils'
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
                media_file: media_url,
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
        } catch (e) {
            log.info('[create] có lỗi', e)
            return {
                error: true,
                data: [],
                message: e.stack
            }
        }
    }

    static async edit(params) {
        try {
            const { post_id, content, media_url, modified_level, loginUser } = params
            if (!post_id || !mongoose.Types.ObjectId.isValid(post_id)) {
                return {
                    error: true,
                    code: HTTP_STATUS[9992].code,
                    message: HTTP_STATUS[9992].message
                }
            }
            const post = await Post.findById(post_id).exec()
            if (!post || post.deleted_at) {
                return {
                    error: true,
                    code: HTTP_STATUS[9992].code,
                    message: HTTP_STATUS[9992].message
                }
            }
            if (post.created_by.user_id != loginUser.id) {
                return {
                    error: true,
                    code: HTTP_STATUS[1009].code,
                    message: HTTP_STATUS[1009].message
                }
            }
            const dataUpdate = {
                content,
                media_url,
                modified_level,
                is_edit: 1,
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            }
            removeRedundant(dataUpdate)
            await Post.findByIdAndUpdate(post_id, dataUpdate)

            return {
                success: true,
                code: HTTP_STATUS[1000].code,
                message: HTTP_STATUS[1000].message
            }
        } catch (e) {
            log.info('[edit] có lỗi', e)
            return {
                error: true,
                data: [],
                message: e.stack
            }
        }
    }

    static async delete(params) {
        try {
            const { post_id, loginUser } = params
            if (!post_id || !mongoose.Types.ObjectId.isValid(post_id)) {
                return {
                    error: true,
                    code: HTTP_STATUS[9992].code,
                    message: HTTP_STATUS[9992].message
                }
            }
            const post = await Post.findById(post_id).exec()
            if (!post || post.deleted_at) {
                return {
                    error: true,
                    code: HTTP_STATUS[9992].code,
                    message: HTTP_STATUS[9992].message
                }
            }
            if (post.created_by.user_id != loginUser.id) {
                return {
                    error: true,
                    code: HTTP_STATUS[1009].code,
                    message: HTTP_STATUS[1009].message
                }
            }
            const data = {
                deleted_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            }
            //xóa mềm
            await Post.findByIdAndUpdate(post_id, data)

            return {
                success: true,
                code: HTTP_STATUS[1000].code,
                message: HTTP_STATUS[1000].message
            }
        } catch (e) {
            log.info('[delete] có lỗi', e)
            return {
                error: true,
                data: [],
                message: e.stack
            }
        }
    }

    static async get(params) {
        try {
            const { post_id, loginUser } = params
            if (!post_id || !mongoose.Types.ObjectId.isValid(post_id)) {
                return {
                    error: true,
                    code: HTTP_STATUS[9992].code,
                    message: HTTP_STATUS[9992].message
                }
            }
            const post = await Post.findById(post_id).exec()
            if (!post || post.deleted_at) {
                return {
                    error: true,
                    code: HTTP_STATUS[9992].code,
                    message: HTTP_STATUS[9992].message
                }
            }

            //check modified_level
            if (!(await this.checkModifiedLevelUser(post, loginUser))) {
                return {
                    error: true,
                    code: HTTP_STATUS[1009].code,
                    message: HTTP_STATUS[1009].message
                }
            }

            // recommend some comment
            const comments = await PostComment.find({
                post_id: post_id,
                deleted_at: null
            }, null, {
                sort: { created_at: -1 },
                limit: 2
            }).exec()
            post._doc.comments = comments
            return {
                success: true,
                code: HTTP_STATUS[1000].code,
                message: HTTP_STATUS[1000].message,
                data: post
            }
        } catch (e) {
            log.info('[get] có lỗi', e)
            return {
                error: true,
                data: [],
                message: e.stack
            }
        }
    }

    static async checkModifiedLevelUser(post, user) {
        switch (post.modified_level) {
            case MODIFIED_LEVEL.PRIVATE:
                return post.created_by.user_id == user.id
            case MODIFIED_LEVEL.FRIEND:
            //check friend
            case MODIFIED_LEVEL.FOLLOWER:
            //check follower
            case MODIFIED_LEVEL.OPTION:
            //check option
        }
        return true
    }
}
