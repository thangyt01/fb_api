const mongoose = require("mongoose")
const moment = require('moment')
const { EMOTION_TYPE } = require("../../../src/components/post/postConstant")

const userSchema = new mongoose.Schema({
    user_id: { type: Number, required: true, index: true },
    full_name: { type: String, required: true },
    avatar_url: { type: String },
    emotion_type: {
        type: String,
        enum: Object.values(EMOTION_TYPE),
        required: false,
    }
}, { versionKey: false, _id: false })

const notificationSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        require: true,
    },
    post_id: {
        type: String,
        require: true
    },
    /**
     * Type:
     * Bày tỏ cảm xúc về bài viết
     * Bày tỏ cảm xúc về bình luận
     * Gắn thẻ
     * Chia sẻ
     * Bạn bè thêm bài viết mới
     * Bạn bè cập nhật ảnh đại diện
     * Bình luận bài viết của mình
     * Trả lời bình luận
     */
    type: {
        type: String,
        require: true
    },
    action_user: {
        type: userSchema,
        require: true
    },
    is_read: { type: Boolean, default: false },
    created_at: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    deleted_at: { type: String, default: null },
})

const appNotificationSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        require: true,
    },
    /**
     * Type:
     * Thông báo kết bạn
     * Sinh nhật
     * vvv
     */
    type: {
        type: String,
        require: true
    },
    action_user: {
        type: userSchema,
        require: false
    },
    is_read: { type: Boolean, default: false },
    created_at: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    deleted_at: { type: String, default: null },
})

const Notification = mongoose.model('notifications', notificationSchema)
const AppNotification = mongoose.model('app_notifications', appNotificationSchema)

module.exports = {
    Notification,
    AppNotification
}
