const OnlineUser = require("../src/models/onlineUser");

let connectedClients = {}
const rooms = [];
const ids = []
module.exports = (io, socket) => {
    //console.log(io)
    //join room
    socket.on("join-room", async payload => {
        payload = JSON.parse(payload)
        switch (payload.mode) {
            case 'room':
                try {

                    let socketId = socket.id;
                    //  return console.log(typeof socketId);
                    const $user = await OnlineUser.create({ user_id: payload.uid, socket_id: socketId });
                    if ($user) {
                        socket.join(payload.uid);
                        connectedClients[socket.id] = payload
                        console.log(payload.uid, "user connected");
                        let users = await OnlineUser.findAll()
                        console.log(users)
                        //replying with all online users
                        io.emit("online-users", JSON.stringify(users));
                    } else {
                        console.log("error")
                    }
                } catch (err) {
                    console.log(err);
                }

                // console.log(payload.uid)



                break;

            case 'team':
                socket.join(payload.team);
                io.to(payload.team).emit('notification', JSON.stringify({ "msg": `${connectedClients[socket.id]["uid"]} has joined the team` }));
                socket.to(connectedClients[socket.id]["uid"]).emit('notification', JSON.stringify({ "msg": `You joined the team` }));
                break;
        }
    });

    //request for all online users
    socket.on('get-online-users', async () => {

        //replying with all online users
        socket.emit("online-users", JSON.stringify(connectedClients))
    })


    //send notification
    socket.on('send-notification', payload => {
        payload = JSON.parse(payload)

        switch (payload.mode) {
            case 'one':
                socket.to(payload.room).emit("notification", JSON.stringify({
                    'msg': payload.msg
                }))
                break;
            case 'all':
                io.emit("notification", JSON.stringify({
                    'msg': payload.msg
                }))
                break;
            case 'some':
                payload['users'].forEach(u => io.to(u).emit('notification', JSON.stringify({
                    'msg': payload.msg,
                    'team': payload.team
                })));
                break;
            case 'team':
                io.to(payload.team).emit('notification', JSON.stringify({
                    'msg': payload.msg
                }));
                break;
        }
    })


    //sending msg
    socket.on('send-message', payload => {
        payload = JSON.parse(payload)
        socket.to(payload.room).emit('message', payload.msg)
    });


    //on disconnect remove the user 
    socket.on("disconnect", async () => {
        // return console.log(socket.id)
        //get connected sockets
        let socketId = socket.id
        let user = await OnlineUser.destroy({
            where:{
                'socket_id':socketId
            }
        });
        // return console.log(user);
        // let sockets = await io.allSockets()
        // let temp = {}
        // let disconnectedUser;

        // console.log("before", connectedClients)
        // console.log(sockets)


        // //filter the disconnected one
        // disconnectedUser = Object.keys(connectedClients).find(el => !sockets.has(el))
        // disconnectedUser = connectedClients[disconnectedUser]

        // //update the connected clients
        // sockets.forEach(el => {
        //     temp[el] = connectedClients[el]
        // })
        // connectedClients = temp


        // console.log("after", connectedClients)
        // console.log(disconnectedUser)

        // //broadcast user has signout
        // io.emit("user-signout", { user: disconnectedUser })
    })


    //create the team rooms
    socket.on('create-team', async payload => {
        payload = JSON.parse(payload);
        socket.join(payload.team)
        console.log(await io.allSockets(), 'rooms')
        console.log(connectedClients[socket.id])
        io.to(connectedClients[socket.id].uid).emit('notification', JSON.stringify({ 'msg': 'Team created!' }))
    })

    //join team
    socket.on('join-team', payload => {
        payload = JSON.parse(payload);
        socket.join(payload.team);
    })
}