const moment = require("moment")
const mongoose = require("mongoose")
const { ACTION_USER } = require("../../../src/components/user/userConstant")

const schema = new mongoose.Schema({
    user_id: { type: Number, index: true, required: true },
    action: { type: String, enum: Object.values(ACTION_USER), required: true },
    instance: { type: String, index: true },
    created_at: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    updated_at: { type: String, default: null },
    deleted_at: { type: String, default: null },
}, { versionKey: false })

const ActionLog = mongoose.model('action_logs', schema)

module.exports = ActionLog