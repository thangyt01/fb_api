import { ElasticSearch } from '.'
import { getAvatarUrlByIds } from '../../src/components/user/userService'
import { getAvatarDefault } from '../../src/helpers/utils/utils'
const db = require('../models/index')
require('../mongoDb/index')

export async function migrateUsersFromDbToEs() {
    try {
        console.log("Start migrate.....")
        let page = 0, limit = 1000
        let users
        const listIndex = await ElasticSearch.listIndex()
        if (!listIndex['users']) {
            await ElasticSearch.createIndex('users')
        }
        do {
            console.log(`migrate users page = ${page}, limit = ${limit}`)
            users = await db.User.findAll({
                attributes: [
                    'id',
                    'username',
                    'firstname',
                    'lastname',
                    'phone',
                    'email',
                    'address',
                    'link_github',
                    'link_twitter',
                    'avatar_id'
                ],
                limit: limit,
                offset: page * limit,
                raw: true
            })
            if (!users.length) break
            let body = ``
            let avatars = await getAvatarUrlByIds(users.map(u => u.avatar_id).filter(u => u))
            let hashAvatar = avatars.reduce((obj, item) => {
                obj[item._id] = item
                return obj
            }, {})
            users = users.map(item => {
                item.avatar_url = hashAvatar[item.avatar_id]?.url || getAvatarDefault()
                return item
            })
            for (let user of users) {
                body += JSON.stringify({
                    index: { _index: 'users', _id: user.id }
                }) + '\r\n' + JSON.stringify(user) + '\r\n'
            }
            await ElasticSearch.bulkDocs(body)
            page++
        } while (users.length > 0)
        console.log("End migrate.....")
        return true
    } catch (e) {
        console.log('migrateFromDbToEs có lỗi', e)
        return false
    }
}
