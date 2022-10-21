const moment = require("moment")
const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    user_id: { type: Number, index: true, required: true },
    content: { type: String },
    url: { type: String },
    created_at: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    updated_at: { type: String, default: null },
    deleted_at: { type: String, default: null },
}, { versionKey: false })

const ActionLog = mongoose.model('action_logs', schema)

module.exports = ActionLog