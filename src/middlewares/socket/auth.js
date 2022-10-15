import { userStatus } from '../../components/user/userConstant'
import { verifyToken } from '../auth'

const models = require('../../../database/models')

export const authentication = async (socket, next) => {
    try {
        const token = extractToken(socket.handshake.headers.authorization || socket.handshake.query.accessToken)
        const decodedToken = verifyToken(token)
        const { id } = decodedToken
        if (!id) {
            socket.disconnect()
            return next(new Error('Unauthorized'))
        }

        const user = await models.User.findOne({
            attributes: [
                'id',
                'username',
                'firstname',
                'lastname',
                'status',
                'avatar_id'
            ],
            where: {
                id: id
            },
            raw: true
        })

        if (user && user.status == userStatus.ACTIVE) {
            user.fullname = user.firstname + user.lastname
            if (!user.fullname) {
                user.fullname = `${(user.username).slice(0, -3)}***`
            }
            socket.loginUser = user
            return next()
        }
        else {
            socket.disconnect()
            return next(new Error('Unauthorized'))
        }
    }
    catch (e) {
        console.log(`authentication Error: ${e.stack || JSON.stringify(e)}`)
        socket.disconnect()
        return next(new Error('Error'))
    }
}


function extractToken(authorization = '') {
    const bearerHeader = authorization.split(' ')
    if (bearerHeader.length === 2 && bearerHeader[0] === 'Bearer') {
        return bearerHeader[1]
    }
    return ''
}