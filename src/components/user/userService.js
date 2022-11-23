import mongoose from 'mongoose'
import { HTTP_STATUS } from '../../helpers/code'
import { Op } from 'sequelize'
const models = require('../../../database/models')
const File = require('../../../database/mongoDb/model/File')

export async function getAvatarUrl(avatar_id) {
    if (!avatar_id || !mongoose.Types.ObjectId.isValid(avatar_id)) return ''
    return await File.findById(avatar_id).exec()
}
export async function getListFriend(params) {
    try {
        const { page, limit, loginUser } = params
        const id = await models.UserRelationship.findAll({
            where: {
                status: 'friend',
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
        let idArr = []
        id.map(i => i.user_id == loginUser.id ? idArr.push(i.other_user_id) : idArr.push(i.user_id))
        let result = await models.User.findAll({
            attributes: ['firstname', 'lastname', 'avatar_id'],
            where: {
                id: {
                    [Op.or]: idArr
                },
                // deleted_at: {
                //     [Op.not]: null
                // }
            }
        })


        return {
            success: true,
            code: HTTP_STATUS[1000].code,
            message: HTTP_STATUS[1000].message,
            data: result
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
        const id = await models.UserRelationship.findAll({
            where: {
                status: 'block',
                user_id: loginUser.id,
            },
            order: [
                ["updated_at", "DESC"]
            ],
            offset: page * limit,
            limit: limit,
        })
        let idArr = []
        if (!id.length) {
            return {
                success: true,
                code: HTTP_STATUS[1000].code,
                message: HTTP_STATUS[1000].message,
                data: []
            }
        }
        id.map(i => i.user_id == loginUser.id ? idArr.push(i.other_user_id) : idArr.push(i.user_id))
        let result = await models.User.findAll({
            attributes: ['firstname', 'lastname', 'avatar_id'],
            where: {
                id: {
                    [Op.or]: idArr
                },
                // deleted_at: {
                //     [Op.not]: null
                // }
            }
        })


        return {
            success: true,
            code: HTTP_STATUS[1000].code,
            message: HTTP_STATUS[1000].message,
            data: result
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
