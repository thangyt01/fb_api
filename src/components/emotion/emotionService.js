import Post from '../../../database/mongoDb/model/Post'
import PostComment from '../../../database/mongoDb/model/PostComment'
import { HTTP_STATUS } from '../../helpers/code'
import { EMOTION_INSTANCE_TYPE } from '../post/postConstant'
import { PostService } from '../post/postService'

const models = require('../../../database/models')

const Logger = require('../../libs/logger')
const log = new Logger(__dirname)

export class EmotionService {
    static async set(params) {
        try {
            const {
                instance_id,
                type,
                emotion_type,
                loginUser
            } = params
            if (!(instance_id && type && emotion_type && loginUser)) {
                return {
                    error: true,
                    code: HTTP_STATUS[1004].code,
                    message: HTTP_STATUS[1004].message
                }
            }
            switch (type) {
                case EMOTION_INSTANCE_TYPE.POST:
                    return await this.setPostOrComment(params, EMOTION_INSTANCE_TYPE.POST)
                case EMOTION_INSTANCE_TYPE.COMMENT:
                    return await this.setPostOrComment(params, EMOTION_INSTANCE_TYPE.COMMENT)
                case EMOTION_INSTANCE_TYPE.FILE:
                    // todo
                    return
                case EMOTION_INSTANCE_TYPE.MESSAGE:
                    // todo
                    return
            }

        } catch (e) {
            log.info('[set] có lỗi', e)
            return {
                error: true,
                data: [],
                message: e.stack
            }
        }
    }

    static async setPostOrComment(params, type = EMOTION_INSTANCE_TYPE.POST) {
        try {
            const {
                instance_id,
                emotion_type,
                loginUser
            } = params
            if (!(instance_id && emotion_type && loginUser)) {
                return {
                    error: true,
                    code: HTTP_STATUS[1004].code,
                    message: HTTP_STATUS[1004].message
                }
            }

            const Instance = type == EMOTION_INSTANCE_TYPE.POST ? Post : PostComment
            const instance = await Instance.findById(instance_id).exec()
            if (!instance || instance.deleted_at) {
                return {
                    error: true,
                    code: HTTP_STATUS[9992].code,
                    message: HTTP_STATUS[9992].message
                }
            }

            const post = type == EMOTION_INSTANCE_TYPE.POST ? instance : await Post.findById(instance.post_id)
            //check modified_level
            if (!(await PostService.checkModifiedLevelUser(post, loginUser))) {
                return {
                    error: true,
                    code: HTTP_STATUS[1009].code,
                    message: HTTP_STATUS[1009].message
                }
            }

            let num = instance.number_emotions
            let emotions = instance.emotions
            const post_user_emotion = emotions.find(item => item.user_id == loginUser.id)

            if (!post_user_emotion) { // bày tỏ cảm xúc lần đầu
                const index = num.findIndex(item => item.emotion_type == emotion_type)
                if (index > -1) {
                    num[index].count++
                } else {
                    num.push({
                        emotion_type: emotion_type,
                        count: 1
                    })
                }
                emotions.push({
                    user_id: loginUser.id,
                    full_name: loginUser.firstname + ' ' + loginUser.lastname,
                    avatar_url: loginUser.avatar_url,
                    emotion_type: emotion_type
                })
            } else if (post_user_emotion.emotion_type != emotion_type) { // bày tỏ cảm xúc khác
                const new_index = num.findIndex(item => item.emotion_type == emotion_type)
                const old_index = num.findIndex(item => item.emotion_type == emotion_type)
                if (new_index > -1) {
                    num[new_index].count++
                } else {
                    num.push({
                        emotion_type: emotion_type,
                        count: 1
                    })
                }
                num[old_index].count--
                const eIndex = emotions.findIndex(item => item.user_id == loginUser.id)
                emotions[eIndex].emotion_type = emotion_type
            } else { // bày tỏ 1 cảm xúc 2 lần == remove
                const index = num.findIndex(item => item.emotion_type == emotion_type)
                num[index].count--
                const eIndex = emotions.findIndex(item => item.user_id == loginUser.id)
                emotions.splice(eIndex, 1)
            }

            await instance.findByIdAndUpdate(instance.id, {
                emotions: emotions,
                number_emotions: num
            })
            return {
                success: true,
                code: HTTP_STATUS[1000].code,
                message: HTTP_STATUS[1000].message
            }
        } catch (e) {
            log.info('[setPostOrComment] có lỗi', e)
            return {
                error: true,
                data: [],
                message: e.stack
            }
        }
    }
}