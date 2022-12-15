const mongoose = require("mongoose")
const moment = require('moment')

const userSchema = new mongoose.Schema({
    user_id: { type: Number, required: true, index: true },
    nick_name: { type: String, required: false },
    deleted_at: { type: String, default: null },
}, { versionKey: false, _id: false })

const schema = new mongoose.Schema({
    name: { type: String },
    is_edit_name: { type: Boolean, required: true, default: false },
    members: [
        { type: userSchema },
    ],
    key: { type: String },
    is_group_chat: { type: Boolean, default: false },
    created_at: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    updated_at: { type: String, default: null },
    deleted_at: { type: String, default: null },
    created_by: { type: Number, required: true }
}, { versionKey: false })

const GroupChat = mongoose.model('group_chats', schema)

module.exports = GroupChat