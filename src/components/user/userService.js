const File = require('../../../database/mongoDb/model/File')

export async function getAvatarUrl(avatar_id) {
    if (!avatar_id) return ''
    return await File.findById(avatar_id).exec()
}