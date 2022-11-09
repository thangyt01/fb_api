import { PostService } from '../post/postService'
import {
    io
} from '../../../bin/www'

const Logger = require('../../libs/logger')
const log = new Logger(__dirname)

export class BksService {
    static get bks() {
        return io.of('/')
    }

    static nameSpaceName = 'bks'

    static getRoomName(roomId) {
        return `${this.nameSpaceName}-room-${roomId}`
    }

    static joinRoom(params) {
        try {
            const { loginUser, socketId } = params
            //join user room
            this.bks.adapter.remoteJoin(socketId, this.getRoomName(loginUser.id))
            //join chat group room

        } catch (e) {
            log.error('[joinRoom] có lỗi', e)
        }
    }

    static leaveRoom(params) {
        try {
            const { loginUser, socketId } = params
            this.bks.adapter.remoteLeave(socketId, this.getRoomName(loginUser.id))

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
            const { loginUser, data } = params
            data.loginUser = loginUser
            // send notification to follower user
            // this.bks.to().emit('client-new-post', {

            // })
            await PostService.create(data)
        } catch (e) {
            log.error('[createPost] có lỗi', e)
        }
    }
}


