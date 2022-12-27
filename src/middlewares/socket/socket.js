const { BksService } = require("../../components/bks/BksService")
const { authentication } = require("./auth")

module.exports = (bks) => {
    bks.use(authentication).on('connection', async (socket) => {
        try {
            const { loginUser = {} } = socket

            /*****************************************
             *********** DEFINE ROOM EVENTS **********
             *****************************************/
            socket.on('join-room', () => {
                const params = {
                    loginUser,
                    socketId: socket.id,
                }
                console.log('Client new subscribe', params)
                BksService.joinRoom(params)
            })

            socket.on('leave-room', () => {
                const params = {
                    loginUser,
                    socketId: socket.id,
                }
                BksService.leaveRoom(params)
            })

            /*****************************************
             *********** DEFINE POST EVENTS **********
             *****************************************/
            socket.on('server-new-post', (data) => {
                const params = {
                    ...data,
                    loginUser
                }
                console.log('server-new-post', params)
                BksService.createPost(params)
            })


            /*****************************************
             *********** DEFINE CHAT EVENTS **********
             *****************************************/
            socket.on('server-new-chat', (data) => {
                const params = {
                    ...data,
                    loginUser
                }
                console.log('server-new-chat', params)
                BksService.createChat(params)
            })

        } catch (error) {
            console.log(`socket bks error ${e.stack || JSON.stringify(e)}`)
        }
    })
}