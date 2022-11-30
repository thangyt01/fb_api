import { HTTP_STATUS } from '../../helpers/code'
import GroupChat from '../../../database/mongoDb/model/GroupChat'
import Chat from '../../../database/mongoDb/model/Chat'
import { getAvatarUrl } from '../user/userService'
import mongoose from 'mongoose'
import { removeRedundant } from '../../helpers/utils/utils'

const models = require('../../../database/models')
const Logger = require('../../libs/logger')
const log = new Logger(__dirname)

export class ChatService {
    /**
     * Tạo tin nhắn đến 1 nhóm chat nào đó hoặc 1 người nào đó, nhóm chat sẽ được ưu tiên cao hơn
     * @param {*} params
     * @returns
     */
    static async create(params) {
        try {
            const {
                group_chat_id,
                content,
                reply_id,
                media_url,
                loginUser
            } = params

            if (!group_chat_id || !mongoose.Types.ObjectId.isValid(group_chat_id)) {
                return {
                    error: true,
                    code: HTTP_STATUS[9994].code,
                    message: HTTP_STATUS[9994].message
                }
            }
            let groupChat = await GroupChat.findById(group_chat_id)

            if (!groupChat || groupChat.deleted_at || !(media_url || content)) {
                return {
                    error: true,
                    code: HTTP_STATUS[9994].code,
                    message: HTTP_STATUS[9994].message
                }
            }

            if (!groupChat.members.find(item => item.user_id == loginUser.id)) {
                return {
                    error: true,
                    code: HTTP_STATUS[1009].code,
                    message: HTTP_STATUS[1009].message
                }
            }

            // check chặn
            const data = {
                group_chat_id: groupChat._id,
                content: content,
                media_file: media_url,
                reply_id: reply_id,
                created_by: loginUser.id
            }
            if (reply_id) {
                const reply = await Chat.findById(reply_id)
                if (!reply || reply.group_chat_id != group_chat_id) {
                    return {
                        error: true,
                        code: HTTP_STATUS[9994].code,
                        message: HTTP_STATUS[9994].message
                    }
                }
                data.reply_id = reply.id
            }
            removeRedundant(data)
            await Chat.create(data)
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
            const {
                receive_id,
                limit,
                page,
                loginUser
            } = params

            if (!receive_id) {
                return {
                    error: true,
                    code: HTTP_STATUS[9994].code,
                    message: HTTP_STATUS[9994].message
                }
            }

            let key
            if (receive_id < loginUser.id) {
                key = `${receive_id}-${loginUser.id}`
            } else {
                key = `${loginUser.id}-${receive_id}`
            }
            let [receive, groupChat] = await Promise.all([
                models.User.findByPk(receive_id),
                GroupChat.findOne({
                    key: key,
                    is_group_chat: false,
                    deleted_at: null
                })
            ])

            if (!receive) {
                return {
                    error: true,
                    code: HTTP_STATUS[9994].code,
                    message: HTTP_STATUS[9994].message
                }
            }

            if (!groupChat) {
                groupChat = await GroupChat.create({
                    members: [
                        {
                            user_id: loginUser.id,
                        },
                        {
                            user_id: receive_id,
                        }
                    ],
                    created_by: loginUser.id,
                    key: key
                })
                return {
                    success: true,
                    code: HTTP_STATUS[1000].code,
                    message: HTTP_STATUS[1000].message,
                    data: {
                        group_chat_id: groupChat._id,
                        members: [
                            {
                                user_id: loginUser.id,
                                fullname: loginUser.firstname + ' ' + loginUser.lastname,
                                avatar_url: loginUser.avatar_url
                            },
                            {
                                user_id: receive.id,
                                fullname: receive.firstname + ' ' + receive.lastname,
                                avatar_url: await getAvatarUrl(receive.avatar_id)
                            }
                        ],
                        messages: []
                    },
                    total: 0
                }
            }

            const where = {
                group_chat_id: groupChat._id,
                deleted_at: null
            }
            const user = groupChat.members.find(item => item.user_id === loginUser.id)
            if (user.deleted_at) {
                where.created_at = {
                    $gt: user.deleted_at
                }
            }
            let [messages, total] = await Promise.all([
                Chat.find(where, null, {
                    sort: { created_at: -1 },
                    skip: page * limit,
                    limit: limit
                }).exec(),
                Chat.countDocuments(where)
            ])

            const replys = []
            for (let mess of messages) {
                if (mess.reply_id) replys.push(mess.reply_id)
            }

            // get reply messages
            if (replys.length) {
                let replyMessages = await Chat.find({
                    _id: replys,
                    deleted_at: null
                })
                replyMessages = replyMessages.reduce((last, now) => {
                    last[now._id] = now
                }, {})
                messages = messages.map(item => {
                    if (item.reply_id) item._doc.reply = replyMessages[item.reply_id]
                })
            }
            return {
                success: true,
                code: HTTP_STATUS[1000].code,
                message: HTTP_STATUS[1000].message,
                data: {
                    group_chat_id: groupChat._id,
                    members: [
                        {
                            user_id: loginUser.id,
                            fullname: loginUser.firstname + ' ' + loginUser.lastname,
                            avatar_url: loginUser.avatar_url
                        },
                        {
                            user_id: receive.id,
                            fullname: receive.firstname + ' ' + receive.lastname,
                            avatar_url: await getAvatarUrl(receive.avatar_id)
                        }
                    ],
                    messages: messages,
                },
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

    static async getGroupChat(params) {
        try {
            const {
                groupChatId,
                limit,
                page,
                loginUser
            } = params

            if (!groupChatId || !mongoose.Types.ObjectId.isValid(groupChatId)) {
                return {
                    error: true,
                    code: HTTP_STATUS[9994].code,
                    message: HTTP_STATUS[9994].message
                }
            }

            let groupChat = await GroupChat.findOne({
                _id: groupChatId,
                deleted_at: null
            })

            if (!groupChat) {
                return {
                    error: true,
                    code: HTTP_STATUS[9994].code,
                    message: HTTP_STATUS[9994].message
                }
            }

            const user = groupChat.members.find(item => item.user_id === loginUser.id)
            if (!user) {
                return {
                    error: true,
                    code: HTTP_STATUS[1009].code,
                    message: HTTP_STATUS[1009].message
                }
            }

            const where = {
                group_chat_id: groupChat._id,
                deleted_at: null
            }

            let users = await models.User.findAll({
                where: {
                    id: groupChat.members.map(item => item.user_id)
                }
            })
            users = users.reduce((obj, item) => {
                obj[item.id] = item
                return obj
            }, {})
            if (user.deleted_at) {
                where.created_at = {
                    $gt: user.deleted_at
                }
            }
            let [messages, total] = await Promise.all([
                Chat.find(where, null, {
                    sort: { created_at: -1 },
                    skip: page * limit,
                    limit: limit
                }).exec(),
                Chat.countDocuments(where)
            ])

            const replys = []
            for (let mess of messages) {
                if (mess.reply_id) replys.push(mess.reply_id)
            }

            // get reply messages
            if (replys.length) {
                let replyMessages = await Chat.find({
                    _id: replys,
                    deleted_at: null
                })
                replyMessages = replyMessages.reduce((last, now) => {
                    last[now._id] = now
                }, {})
                messages = messages.map(item => {
                    if (item.reply_id) item._doc.reply = replyMessages[item.reply_id]
                })
            }
            return {
                success: true,
                code: HTTP_STATUS[1000].code,
                message: HTTP_STATUS[1000].message,
                data: {
                    group_chat_id: groupChat._id,
                    members: await Promise.all(groupChat.members.map(async item => {
                        const user = users[item.user_id]
                        item.fullname = user.firstname + ' ' + user.lastname
                        item.avatar_url = await getAvatarUrl(user.avatar_id)
                        return item
                    })),
                    messages: messages,
                },
                total: total
            }
        } catch (e) {
            log.info('[getGroupChat] có lỗi', e)
            return {
                error: true,
                data: [],
                message: e.stack
            }
        }
    }
}