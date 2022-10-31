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
            const { post_id, content, media_url, reply_id, loginUser } = params
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
            let { post_id, reply_id, page, limit, loginUser } = params
            if (!post_id || !mongoose.Types.ObjectId.isValid(post_id)) {
                return {
                    error: true,
                    message: HTTP_STATUS[9992].message,
                    code: HTTP_STATUS[9992].code
                }
            }
            if (reply_id && !mongoose.Types.ObjectId.isValid(reply_id)) {
                return {
                    error: true,
                    message: HTTP_STATUS[9994].message,
                    code: HTTP_STATUS[9994].code
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
            const where = {
                post_id: post_id,
                deleted_at: null,
                reply_id: reply_id
            }
            let [comments, total] = await Promise.all([
                PostComment.find(where, null, {
                    sort: { created_at: -1 },
                    skip: page * limit,
                    limit: limit
                }).exec(),
                PostComment.countDocuments(where)
            ])
            // get sub-comment from comments
            let subComment = await PostComment.aggregate([
                {
                    $match: {
                        reply_id: {
                            $in: comments.map(item => item._id)
                        }
                    }
                },
                {
                    $sort: { created_at: -1 }
                },
                {
                    $group: {
                        _id: "$reply_id",
                        comment_id: { $first: "$_id" },
                        post_id: { $first: "$post_id" },
                        content: { $first: "$content" },
                        emotions: { $first: "$emotions" },
                        media_file: { $first: "$media_file" },
                        number_emotions: { $first: "$number_emotions" },
                        reply_id: { $first: "$reply_id" },
                        is_edit: { $first: "$is_edit" },
                        created_at: { $first: "$created_at" },
                        updated_at: { $first: "$updated_at" },
                        deleted_at: { $first: "$deleted_at" },
                        created_by: { $first: "$created_by" },
                        total: { $sum: 1 }
                    }
                }
            ])
            subComment = subComment.reduce((obj, item) => {
                obj[item._id] = item
                return obj
            }, {})
            comments = comments.map(item => {
                item._doc.sub_comment = null
                item._doc.total_sub_comment = 0
                if (subComment[item._id]) {
                    const { _id, comment_id, total, ...rest } = subComment[item._id]
                    rest._id = comment_id
                    item._doc.sub_comment = rest
                    item._doc.total_sub_comment = total
                }
                return item
            })
            return {
                success: true,
                code: HTTP_STATUS[1000].code,
                message: HTTP_STATUS[1000].message,
                data: comments,
                total: total
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

    static async edit(params) {
        try {
            const { comment_id, content, media_url, loginUser } = params
            if (!comment_id || !mongoose.Types.ObjectId.isValid(comment_id)) {
                return {
                    error: true,
                    code: HTTP_STATUS[9994].code,
                    message: HTTP_STATUS[9994].message
                }
            }
            const comment = await PostComment.findById(comment_id).exec()
            if (!comment || comment.deleted_at) {
                return {
                    error: true,
                    code: HTTP_STATUS[9994].code,
                    message: HTTP_STATUS[9994].message
                }
            }
            if (comment.created_by.user_id != loginUser.id) {
                return {
                    error: true,
                    code: HTTP_STATUS[1009].code,
                    message: HTTP_STATUS[1009].message
                }
            }
            const post = await Post.findById(comment.post_id).exec()
            if (!post || post.deleted_at) {
                return {
                    error: true,
                    code: HTTP_STATUS[9992].code,
                    message: HTTP_STATUS[9992].message
                }
            }
            if (!(await PostService.checkModifiedLevelUser(post, loginUser))) {
                return {
                    error: true,
                    code: HTTP_STATUS[1009].code,
                    message: HTTP_STATUS[1009].message
                }
            }
            const dataUpdate = {
                content,
                media_url,
                is_edit: 1,
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            }
            removeRedundant(dataUpdate)
            await PostComment.findByIdAndUpdate(comment_id, dataUpdate)

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
            const { comment_id, loginUser } = params
            if (!comment_id || !mongoose.Types.ObjectId.isValid(comment_id)) {
                return {
                    error: true,
                    code: HTTP_STATUS[9994].code,
                    message: HTTP_STATUS[9994].message
                }
            }
            const comment = await PostComment.findById(comment_id).exec()
            if (!comment || comment.deleted_at) {
                return {
                    error: true,
                    code: HTTP_STATUS[9994].code,
                    message: HTTP_STATUS[9994].message
                }
            }
            const post = await Post.findById(comment.post_id).exec()
            if (!post || post.deleted_at) {
                return {
                    error: true,
                    code: HTTP_STATUS[9994].code,
                    message: HTTP_STATUS[9994].message
                }
            }
            if (comment.created_by.user_id != loginUser.id || loginUser.id != post.created_by.user_id) {
                return {
                    error: true,
                    code: HTTP_STATUS[1009].code,
                    message: HTTP_STATUS[1009].message
                }
            }
            //xóa mềm
            await Promise.all([
                PostComment.findByIdAndUpdate(comment_id, {
                    deleted_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                }),
                Post.findByIdAndUpdate(comment.post_id, {
                    number_comment: post.number_comment - 1
                })
            ])

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
}
