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
                    bks
                }
                BksService.joinRoom(params)
            })

            socket.on('leave-room', () => {
                const params = {
                    loginUser,
                    socketId: socket.id,
                    bks
                }
                BksService.leaveRoom(params)
            })

            /*****************************************
             *********** DEFINE POST EVENTS **********
             *****************************************/
            socket.on('server-new-post', (data) => {
                const params = {
                    data,
                    bks,
                    loginUser
                }
                BksService.createPost(params)
            })
        } catch (error) {
            console.log(`socket bks error ${e.stack || JSON.stringify(e)}`)
        }
    })
}