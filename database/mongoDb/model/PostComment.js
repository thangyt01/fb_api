const mongoose = require("mongoose")
const moment = require('moment')
const { userSchema, mediaFileSchema, numberEmotionSchema } = require("./Post")

const schema = new mongoose.Schema({
    post_id: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    content: { type: String },
    emotions: [
        {
            type: userSchema,
            required: true
        }
    ],
    media_file: [
        {
            type: mediaFileSchema,
        }
    ],
    number_emotions: [
        {
            type: numberEmotionSchema,
        }
    ],
    reply_id: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    parent_id: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
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