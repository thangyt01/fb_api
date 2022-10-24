const moment = require("moment")
const mongoose = require("mongoose")
const { FILE_MEDIA_TYPE } = require("../../../src/components/post/postConstant")

const schema = new mongoose.Schema({
    name: { type: String },
    origin_name: { type: String },
    url: { type: String },
    type: {
        type: String,
        required: true,
        default: FILE_MEDIA_TYPE.OTHER,
        enum: Object.values(FILE_MEDIA_TYPE)
    },
    upload_by: { type: Number, required: true, index: true },
    created_at: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    updated_at: { type: String, default: null },
    deleted_at: { type: String, default: null },
}, { versionKey: false })

const File = mongoose.model('files', schema)

module.exports = File