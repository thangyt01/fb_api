'use strict'

import { EventEmitter } from "./EventEmiter"
import {
    io
} from '../../../bin/www'

export class ClientEmiter extends EventEmitter {
    static get io() {
        return io.of('/')
    }

    static get nameSpace() {
        return 'bks'
    }

    static getRoomName(roomId) {
        return `${this.nameSpace}-room-${roomId}`
    }

    static toUsers(userIds = []) {
        const rooms = userIds.map(userId => this.getRoomName(userId))
        this.io.to(rooms)
        return this
    }

    static exceptUser(userIds = []) {
        const rooms = userIds.map(userId => this.getRoomName(userId))
        this.io.except(rooms)
        return this
    }

    static emit(event, data) {
        this.io.emit(event, data)
    }
}