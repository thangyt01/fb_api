const mongoose = require("mongoose")
const moment = require('moment')
const { EMOTOIN_TYPE, FILE_MEDIA_TYPE } = require("../../../src/components/post/postConstant")

const userSchema = new mongoose.Schema({
    user_id: { type: Number, required: true, index: true },
    full_name: { type: String, required: true },
    avatar_url: { type: String },
    emotion_type: {
        type: String,
        enum: Object.values(EMOTOIN_TYPE),
        required: false,
    }
}, { versionKey: false, _id: false })

const mediaFileSchema = new mongoose.Schema({
    url: { type: String, required: true },
    type: {
        type: String,
        required: true,
        default: FILE_MEDIA_TYPE.OTHER,
        enum: Object.values(FILE_MEDIA_TYPE)
    }
}, { versionKey: false, _id: false })

const numberEmotionSchema = new mongoose.Schema({
    emotion_type: {
        type: String,
        enum: Object.values(EMOTOIN_TYPE),
        required: false,
        default: EMOTOIN_TYPE.LIKE,
    },
    count: { type: Number, required: true, default: 0 }
}, { versionKey: false, _id: false })

const schema = new mongoose.Schema({
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    content: { type: String },
    emotions: [
        {
            type: userSchema,
        }
    ],
    media_file: {
        type: mediaFileSchema,
        require: false
    },
    number_emotions: [
        {
            type: numberEmotionSchema,
        }
    ],
    reply_id: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'PostComment', index: true },
    // parent_id: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'PostComment', index: true },
    is_edit: { type: Number, default: null },
    created_at: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    updated_at: { type: String, default: null },
    deleted_at: { type: String, default: null },
    created_by: {
        type: userSchema,
        required: true
    }
}, { versionKey: false })

const PostComment = mongoose.model('post_comments', schema)

module.exports = PostComment