import mongoose from 'mongoose'
import { HTTP_STATUS } from '../../helpers/code'
import { Op } from 'sequelize'
import { RELATIONSHIP_STATUS } from '../auth/authConstant'
import { getAvatarDefault } from '../../helpers/utils/utils'
import { ElasticSearch } from '../../../database/elasticSearch'
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
        const data = await getUser(idArr)

        return {
            success: true,
            code: HTTP_STATUS[1000].code,
            message: HTTP_STATUS[1000].message,
            data,
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

export async function findUser(params) {
    try {
        const { name, loginUser } = params
        const { rows = [], count } = await models.User.findAndCountAll({
            where: {
                deleted_at: {
                    [Op.eq]: null
                }
            },
            order: [
                ["updated_at", "DESC"]
            ]
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
        const userFilter = rows.filter(i => `${i.firstname} ${i.lastname}`.includes(name))

        const blockUser = await getListBlockUser({ page: 0, limit: 9999, loginUser })
        userFilter = userFilter.filter(i=>blockUser.data.find(user=>user.id !== i.id))
        userFilter.map(i => idArr.push(i.user_id))
        const data = await getUser(idArr)

        return {
            success: true,
            code: HTTP_STATUS[1000].code,
            message: HTTP_STATUS[1000].message,
            data,
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

export async function getListFriendRequest(params) {
    try {
        const { page, limit, loginUser } = params
        const { rows = [], count } = await models.UserRelationship.findAndCountAll({
            where: {
                status: RELATIONSHIP_STATUS.PENDING,
                other_user_id: loginUser.id
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
        const data = await getUser(idArr)

        return {
            success: true,
            code: HTTP_STATUS[1000].code,
            message: HTTP_STATUS[1000].message,
            data,
            total: count
        }
    } catch (e) {
        log.info('[get-list-friend-request] có lỗi', e)
        return {
            error: true,
            data: [],
            message: e.stack
        }
    }
}

async function getUser(userIdArr) {
    let users = await models.User.findAll({
        attributes: ['id', 'firstname', 'lastname', 'avatar_id'],
        where: {
            id: userIdArr
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
    return users
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

export async function getListUser(params) {
    try {
        const { page, limit, keyword, loginUser } = params
        if (!keyword) {
            return {
                error: true,
                code: HTTP_STATUS[1004].code,
                message: HTTP_STATUS[1004].message,
            }
        }
        const resultEs = await ElasticSearch.search({
            index_name: 'users',
            page,
            limit,
            query: {
                multi_match: {
                    query: keyword,
                    fields: ["username", "lastname", "firstname", "phone", "email", "link_github", "link_twitter", "address"]
                }
            }
        })

        const userRelation = await models.UserRelationship.findAll({
            where: {
                [Op.or]: [
                    { user_id: loginUser.id },
                    { other_user_id: loginUser.id },
                ],
            },
            raw: true
        })
        const listBlock = userRelation.filter(u => u.status === RELATIONSHIP_STATUS.BLOCK)
        const hashUser = userRelation.reduce((obj, item) => {
            const key = item.user_id < item.other_user_id ? `${item.user_id}_${item.other_user_id}` : `${item.other_user_id}_${item.user_id}`
            obj[key] = item
            return obj
        }, {})

        let listUser = resultEs.hits.hits.filter(user => !listBlock.find(item => item.id == user._id))
            .map(user => {
                const key = user._id < loginUser.id ? `${user._id}_${loginUser.id}` : `${loginUser.id}_${user._id}`
                const hash = hashUser[key]
                if (hash) {
                    let relation
                    if (hash.status === RELATIONSHIP_STATUS.FRIEND) {
                        relation = RELATIONSHIP_STATUS.FRIEND
                    } else if (hash.status === RELATIONSHIP_STATUS.PENDING) {
                        relation = RELATIONSHIP_STATUS.PENDING
                        user._source.is_send_invitation = false
                        if (hash.user_id === loginUser.id) { // loginUser là người gửi lời mời kết bạn
                            user._source.is_send_invitation = true
                        }
                    }
                    user._source.relation_ship = relation
                }
                return user._source
            })
        return {
            success: true,
            code: HTTP_STATUS[1000].code,
            message: HTTP_STATUS[1000].message,
            data: listUser,
            total: resultEs.hits.total.value
        }
    } catch (e) {
        log.info('[getListUser] có lỗi', e)
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
            _id: {
                $in: avatar_ids
            },
            deleted_at: null
        })
    } catch (e) {
        throw e
    }
}
