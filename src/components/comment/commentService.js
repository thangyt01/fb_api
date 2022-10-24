import moment from 'moment'
import mongoose from 'mongoose'
import Post from '../../../database/mongoDb/model/Post'
import { HTTP_STATUS } from '../../helpers/code'
import { removeRedundant } from '../../helpers/utils/utils'
import { PostService } from '../post/postService'

const PostComment = require('../../../database/mongoDb/model/PostComment')
const Logger = require('../../libs/logger')
const log = new Logger(__dirname)

export class CommentService {
    static async create(params) {
        try {
            const { post_id, content, media_url, reply_id, parent_id, loginUser } = params
            if (!post_id || !mongoose.Types.ObjectId.isValid(post_id)) {
                return {
                    error: true,
                    message: HTTP_STATUS[9992].message,
                    code: HTTP_STATUS[9992].code
                }
            }
            const post = await Post.findById(post_id)
            if (!post || post.deleted_at) {
                return {
                    error: true,
                    message: HTTP_STATUS[9992].message,
                    code: HTTP_STATUS[9992].code
                }
            }
            //check modified_level
            if (!(await PostService.checkModifiedLevelUser(post, loginUser))) {
                return {
                    error: true,
                    code: HTTP_STATUS[1009].code,
                    message: HTTP_STATUS[1009].message
                }
            }
            const data = {
                post_id,
                content,
                media_file: media_url,
                reply_id,
                parent_id,
                created_by: {
                    user_id: loginUser.id,
                    full_name: loginUser.firstname + ' ' + loginUser.lastname,
                    avatar_url: loginUser.avatar_url
                }
            }
            removeRedundant(data)
            const comment = new PostComment(data)
            await Promise.all([
                comment.save(),
                Post.findByIdAndUpdate(post_id, {
                    number_comment: post.number_comment + 1
                })
            ])
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

    static async get(params) {
        try {
            let { post_id, page, limit, loginUser } = params
            if (!post_id || !mongoose.Types.ObjectId.isValid(post_id)) {
                return {
                    error: true,
                    message: HTTP_STATUS[9992].message,
                    code: HTTP_STATUS[9992].code
                }
            }
            const post = await Post.findById(post_id)
            if (!post || post.deleted_at) {
                return {
                    error: true,
                    message: HTTP_STATUS[9992].message,
                    code: HTTP_STATUS[9992].code
                }
            }
            //check modified_level
            if (!(await PostService.checkModifiedLevelUser(post, loginUser))) {
                return {
                    error: true,
                    code: HTTP_STATUS[1009].code,
                    message: HTTP_STATUS[1009].message
                }
            }
            const comments = await PostComment.find({
                post_id: post_id,
                deleted_at: null
            }, null, {
                sort: { created_at: -1 },
                skip: page * limit,
                limit: limit
            }).exec()

            return {
                success: true,
                code: HTTP_STATUS[1000].code,
                message: HTTP_STATUS[1000].message,
                data: comments
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

    // static async edit(params) {
    //     try {
    //         const { post_id, content, media_url, modified_level, loginUser } = params
    //         if (!post_id || !mongoose.Types.ObjectId.isValid(post_id)) {
    //             return {
    //                 error: true,
    //                 code: HTTP_STATUS[9992].code,
    //                 message: HTTP_STATUS[9992].message
    //             }
    //         }
    //         const post = await Post.findById(post_id).exec()
    //         if (!post_id) {
    //             return {
    //                 error: true,
    //                 code: HTTP_STATUS[9992].code,
    //                 message: HTTP_STATUS[9992].message
    //             }
    //         }
    //         if (post.created_by.user_id != loginUser.id) {
    //             return {
    //                 error: true,
    //                 code: HTTP_STATUS[1009].code,
    //                 message: HTTP_STATUS[1009].message
    //             }
    //         }
    //         const dataUpdate = {
    //             content,
    //             media_url,
    //             modified_level,
    //             is_edit: 1,
    //             updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    //         }
    //         removeRedundant(dataUpdate)
    //         await Post.findByIdAndUpdate(post_id, dataUpdate)

    //         return {
    //             success: true,
    //             code: HTTP_STATUS[1000].code,
    //             message: HTTP_STATUS[1000].message
    //         }
    //     } catch (e) {
    //         log.info('[edit] có lỗi', e)
    //         return {
    //             error: true,
    //             data: [],
    //             message: e.stack
    //         }
    //     }
    // }

    // static async delete(params) {
    //     try {
    //         const { post_id, loginUser } = params
    //         if (!post_id || !mongoose.Types.ObjectId.isValid(post_id)) {
    //             return {
    //                 error: true,
    //                 code: HTTP_STATUS[9992].code,
    //                 message: HTTP_STATUS[9992].message
    //             }
    //         }
    //         const post = await Post.findById(post_id).exec()
    //         if (!post_id) {
    //             return {
    //                 error: true,
    //                 code: HTTP_STATUS[9992].code,
    //                 message: HTTP_STATUS[9992].message
    //             }
    //         }
    //         if (post.created_by.user_id != loginUser.id) {
    //             return {
    //                 error: true,
    //                 code: HTTP_STATUS[1009].code,
    //                 message: HTTP_STATUS[1009].message
    //             }
    //         }
    //         const data = {
    //             deleted_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    //         }
    //         //xóa mềm
    //         await Post.findByIdAndUpdate(post_id, data)

    //         return {
    //             success: true,
    //             code: HTTP_STATUS[1000].code,
    //             message: HTTP_STATUS[1000].message
    //         }
    //     } catch (e) {
    //         log.info('[delete] có lỗi', e)
    //         return {
    //             error: true,
    //             data: [],
    //             message: e.stack
    //         }
    //     }
    // }
}
