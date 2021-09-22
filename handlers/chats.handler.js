let connectedClients = {}
let clients = [];
module.exports = (io, socket, nsp) => {

    //sending msg
    socket.on('send-message', payload => {
        payload = JSON.parse(payload)
        socket.to(payload.room).emit('message', payload.msg)
    });

}