import { PostService } from '../post/postService'

const Logger = require('../../libs/logger')
const log = new Logger(__dirname)

export class BksService {
    static nameSpaceName = 'bks'

    static getRoomName(roomId) {
        return `${this.nameSpaceName}-room-${roomId}`
    }

    static joinRoom(params) {
        try {
            const { loginUser, socketId, bks } = params
            //join user room
            bks.adapter.remoteJoin(socketId, this.getRoomName(loginUser.id))
            //join chat group room

        } catch (e) {
            log.error('[joinRoom] có lỗi', e)
        }
    }

    static leaveRoom(params) {
        try {
            const { loginUser, socketId, bks } = params
            bks.adapter.remoteLeave(socketId, this.getRoomName(loginUser.id))

        } catch (e) {
            log.error('[leaveRoom] có lỗi', e)
        }
    }

    /**
     *
     * @param {*} params
     */
    static async createPost(params) {
        try {
            const { bks, loginUser, data } = params
            data.loginUser = loginUser
            // send notification to follower user
            // bks.to().emit('client-new-post', {

            // })
            await PostService.create(data)
        } catch (e) {
            log.error('[createPost] có lỗi', e)
        }
    }
}


