import mongoose from 'mongoose'
import { HTTP_STATUS } from '../../helpers/code'
import { Op } from 'sequelize'
import { RELATIONSHIP_STATUS } from '../auth/authConstant'
import { getAvatarDefault } from '../../helpers/utils/utils'
const models = require('../../../database/models')
const File = require('../../../database/mongoDb/model/File')

export async function getAvatarUrl(avatar_id) {
    if (!avatar_id || !mongoose.Types.ObjectId.isValid(avatar_id)) return getAvatarDefault()
    const file = await File.findById(avatar_id)
    return file.url
}
export async function getListFriend(params) {
    try {
        const { page, limit, loginUser } = params
        const { rows = [], count } = await models.UserRelationship.findAndCountAll({
            where: {
                status: RELATIONSHIP_STATUS.FRIEND,
                [Op.or]: [
                    { user_id: loginUser.id },
                    { other_user_id: loginUser.id },
                ],
            },
            order: [
                ["updated_at", "DESC"]
            ],
            offset: page * limit,
            limit: limit,
        })
        if (!rows.length) {
            return {
                success: true,
                code: HTTP_STATUS[1000].code,
                message: HTTP_STATUS[1000].message,
                data: [],
                total: count
            }
        }
        let idArr = []
        rows.map(i => i.user_id == loginUser.id ? idArr.push(i.other_user_id) : idArr.push(i.user_id))
        let users = await models.User.findAll({
            attributes: ['id', 'firstname', 'lastname', 'avatar_id'],
            where: {
                id: idArr
            },
            raw: true
        })
        const avatar_ids = []
        for (let user of users) {
            if (user.avatar_id) {
                avatar_ids.push(user.avatar_id)
            }
        }
        const avatar_urls = await getAvatarUrlByIds(avatar_ids)
        let avatar_map = avatar_urls.reduce((obj, item) => {
            obj[item._id] = item
            return obj
        }, {})
        users = users.map(item => {
            item.avatar_url = avatar_map[item.avatar_id]?.url || getAvatarDefault()
            return item
        })

        return {
            success: true,
            code: HTTP_STATUS[1000].code,
            message: HTTP_STATUS[1000].message,
            data: users,
            total: count
        }
    } catch (e) {
        log.info('[get-list-friend] có lỗi', e)
        return {
            error: true,
            data: [],
            message: e.stack
        }
    }
}

export async function getListBlockUser(params) {
    try {
        const { page, limit, loginUser } = params
        const { rows = [], count } = await models.UserRelationship.findAndCountAll({
            where: {
                status: RELATIONSHIP_STATUS.BLOCK,
                user_id: loginUser.id,
            },
            order: [
                ["updated_at", "DESC"]
            ],
            offset: page * limit,
            limit: limit,
        })
        let idArr = []
        if (!rows.length) {
            return {
                success: true,
                code: HTTP_STATUS[1000].code,
                message: HTTP_STATUS[1000].message,
                data: [],
                total: count
            }
        }
        rows.map(i => i.user_id == loginUser.id ? idArr.push(i.other_user_id) : idArr.push(i.user_id))
        let users = await models.User.findAll({
            attributes: ['id', 'firstname', 'lastname', 'avatar_id'],
            where: {
                id: idArr
            },
            raw: true
        })

        const avatar_ids = []
        for (let user of users) {
            if (user.avatar_id) {
                avatar_ids.push(user.avatar_id)
            }
        }
        const avatar_urls = await getAvatarUrlByIds(avatar_ids)
        let avatar_map = avatar_urls.reduce((obj, item) => {
            obj[item._id] = item
            return obj
        }, {})
        users = users.map(item => {
            item.avatar_url = avatar_map[item.avatar_id].url || getAvatarDefault
            return item
        })

        return {
            success: true,
            code: HTTP_STATUS[1000].code,
            message: HTTP_STATUS[1000].message,
            data: users,
            total: count
        }
    } catch (e) {
        log.info('[get-list-block-user] có lỗi', e)
        return {
            error: true,
            data: [],
            message: e.stack
        }
    }
}

export async function getAvatarUrlByIds(avatar_ids) {
    try {
        return await File.find({
            _id: avatar_ids,
            deleted_at: null
        })
    } catch (e) {
        throw e
    }
}
