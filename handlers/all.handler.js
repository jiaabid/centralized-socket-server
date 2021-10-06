//const { Json } = require("sequelize/types/lib/utils");
const Chats = require("../src/models/chat");
const OnlineUser = require("../src/models/onlineUser");
const { Op } = require('sequelize');
const ChatUser = require("../src/models/chatUser");
const Messages = require("../src/models/message");
const ChatMessage = require("../src/models/chatMessage");

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
                        socket.join(`${payload.uid}`);
                        // connectedClients[socket.id] = payload
                        console.log(payload.uid, "user connected");
                        let users = await OnlineUser.findAll()
                        // console.log(users)
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
            case 'chatrooms':
                payload["rooms"].forEach(room => {
                    // console.log(room["chat_id"])
                    socket.join(`${room["name"]}`)
                })
                break;
            case 'team':
                socket.join(`${payload.team}`);
                io.to(payload.team).emit('notification', JSON.stringify({ "msg": `${connectedClients[socket.id]["uid"]} has joined the team` }));
                socket.to(connectedClients[socket.id]["uid"]).emit('notification', JSON.stringify({ "msg": `You joined the team` }));
                break;
        }
    });

    //request for all online users
    socket.on('get-online-users', async () => {

        //replying with all online users
        let users = await OnlineUser.findAll()

        socket.emit("online-users", JSON.stringify(users))
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
    socket.on('send-message', async payload => {
        payload = JSON.parse(payload)
        // console.log(payload.room)
        //    console.log( io.sockets.adapter.rooms)
        let message = await Messages.create(payload.msg)
        // return console.log(message["dataValues"]["id"])
        await ChatMessage.create({
            chat_id: payload.chat_id,
            message_id: message["dataValues"]["id"]
        });
        socket.to(payload.room).emit('message', payload.msg.message)
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

    socket.on('create-chat', async payload => {
        console.log("in create chat")
        let chat;
        payload = JSON.parse(payload);
        // return console.log(payload)
        let existing = await Chats.findOne({
            where: {
                name: payload.name
            }
        })

        if (!existing) {
            chat = await Chats.create({
                name: payload.name
            });
            await ChatUser.create({
                chat_id: chat["dataValues"].id,
                user_id: payload.userId
            })
            await ChatUser.create({
                chat_id: chat["dataValues"].id,
                user_id: payload.sendTo
            })
            return console.log(chat);
        }
        await ChatUser.create({
            chat_id: existing["dataValues"].id,
            user_id: payload.userId
        })
        await ChatUser.create({
            chat_id: existing["dataValues"].id,
            user_id: payload.sendTo
        })
        return console.log(chat);
        // return console.log(chat)

    })
    socket.on('create-group-chat', async payload => {
        console.log("in create chat")
        let chat;
        payload = JSON.parse(payload);
        // return console.log(payload)
        let existing = await Chats.findOne({
            where: {
                name: payload.name
            }
        })

        if (!existing) {
            chat = await Chats.create({
                name: payload.name
            });
            await ChatUser.create({
                chat_id: chat["dataValues"].id,
                user_id: payload.userId
            })
            await insertUser(payload.users, chat["dataValues"].id)

            return ""
        } else {
            await insertUser(payload.users, existing["dataValues"].id)

        }
        return console.log(chat);
        // return console.log(chat)

    })
    async function insertUser(users, id) {
        users.forEach(async user => {
            await ChatUser.create({
                chat_id: id,
                user_id: user
            })
        })
    }
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