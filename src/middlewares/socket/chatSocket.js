const { authentication } = require("./auth")

module.exports = (chatSocket) => {
    const nameSpaceName = 'chat'
    chatSocket.use(authentication).on('connection', async (socket) => {
        socket.on('events', data => {
            console.log("data")
        })
    })
}