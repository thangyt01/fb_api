const mongoose = require("mongoose")
const moment = require('moment')
const { EMOTION_TYPE, FILE_MEDIA_TYPE } = require("../../../src/components/post/postConstant")

const userSchema = new mongoose.Schema({
    user_id: { type: Number, required: true, index: true },
    emotion_type: {
        type: String,
        enum: Object.values(EMOTION_TYPE),
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

const schema = new mongoose.Schema({
    group_chat_id: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupChat', required: true, index: true },
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
    number_emotions: {
        type: Map,
    },
    reply_id: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'Chat', index: true },
    is_edit: { type: Boolean, default: false },
    read_at: { type: Map },
    created_at: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    updated_at: { type: String, default: null },
    deleted_at: { type: String, default: null },
    created_by: { type: Number, required: true }
}, { versionKey: false })

const Chat = mongoose.model('chats', schema)

module.exports = Chat