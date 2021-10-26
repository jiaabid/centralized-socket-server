let connectedClients = {}
let connectedUsers = [];
const OnlineUser = require("../src/models/onlineUser");
const { Op } = require('sequelize');

module.exports = (io, socket) => {

    io.emit('hello')
    //join room
    socket.on("join-room", async payload => {
        payload = JSON.parse(payload)
        switch (payload.mode) {
            case 'room':
                try {

                    let socketId = socket.id;
                    let user;
                    //push user to temporary data structure
                    connectedUsers.find(user => user.user_id == payload.uid) ? connectedUsers.find(user => {
                        if (user.user_id == payload.uid) {
                            user.socket_id = socket.id
                        }
                    }) :
                        connectedUsers.push({
                            user_id: payload.uid,
                            socket_id: socket.id
                        })
                    // const sockets = await io.fetchSockets();
                    // console.log("sockets",sockets)
                    console.log('users', connectedUsers)
                    //join the room
                    socket.join(`${payload.uid}`);

                    console.log(io.sockets.adapter.rooms)
                    //replying with all online users
                    // socket.emit("online-users", JSON.stringify(connectedUsers));
                    // io.emit('hello')

                    io.emit("online-users", JSON.stringify(connectedUsers));
                    let existingUser = await OnlineUser.findOne({
                        where: {
                            user_id: payload.uid
                        }
                    });

                    if (existingUser) {
                        user = await OnlineUser.update({ socket_id: socketId }, {
                            where: {
                                user_id: payload.uid
                            }
                        });
                    } else {
                        user = await OnlineUser.create({ user_id: payload.uid, socket_id: socketId });

                    }

                    //if error in creating user then send all the old connected users
                    if (!user) {
                        socket.join(`${payload.uid}`);
                        let users = await OnlineUser.findAll()

                        //replying with all online users
                        io.emit("online-users", JSON.stringify(users));
                    }
                    // else {
                    //     console.log("error")
                    // }
                } catch (err) {
                    console.log(err);
                }

                break;
            case 'chatrooms':
                if (payload["rooms"]) {
                    payload["rooms"].forEach(room => {
                        // console.log(room["chat_id"])
                        socket.join(`${room["name"]}`)
                    })
                }

                break;
        }
    });


    //on disconnect remove the user 
    socket.on("disconnect", async () => {
        // return console.log(socket.id)
        //get connected sockets
        let socketId = socket.id
        let userId = await OnlineUser.findOne({
            attributes: ['id', 'user_id', 'socket_id'],
            where: {
                'socket_id': socketId
            }
        });
        // return console.log(userId["dataValues"]);
        let user = await OnlineUser.destroy({
            where: {
                [Op.or]: [
                    { 'socket_id': socketId },
                    { 'user_id': userId["dataValues"]["user_id"] },

                ]

            }
        });
        // //broadcast user has signout
        io.emit("user-signout", { user: userId["dataValues"]["user_id"] })
    })

    //request for all online users
    socket.on('get-online-users', async () => {

        //replying with all online users
        // let users = await OnlineUser.findAll()

        socket.emit("online-users", JSON.stringify(connectedUsers))
    })

}