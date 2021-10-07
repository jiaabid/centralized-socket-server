//const { Json } = require("sequelize/types/lib/utils");
const Chats = require("../src/models/chat");
const OnlineUser = require("../src/models/onlineUser");
const { Op } = require('sequelize');
const ChatUser = require("../src/models/chatUser");
const Messages = require("../src/models/message");
const ChatMessage = require("../src/models/chatMessage");
const GroupMessages = require("../src/models/groupMessage");
const Notifications = require("../src/models/notification");
const GroupNotifications = require("../src/models/groupNotification");
const NotificationUser = require("../src/models/notificationUser");
const GroupChatMessage = require("../src/models/groupChatMessage");

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
                    const $user = await OnlineUser.create({ user_id: payload.uid, socket_id: socketId });
                    if ($user) {
                        socket.join(`${payload.uid}`);
                        // connectedClients[socket.id] = payload
                        console.log(payload.uid, "user connected");
                        let users = await OnlineUser.findAll()
                  
                        //replying with all online users
                        io.emit("online-users", JSON.stringify(users));
                    } else {
                        console.log("error")
                    }
                } catch (err) {
                    console.log(err);
                }

                break;
            case 'chatrooms':
                if(payload["rooms"]){
                    payload["rooms"].forEach(room => {
                        // console.log(room["chat_id"])
                        socket.join(`${room["name"]}`)
                    })
                }
              
                break;
            // case 'team':
            //     socket.join(`${payload.team}`);
            //     io.to(payload.team).emit('notification', JSON.stringify({ "msg": `${connectedClients[socket.id]["uid"]} has joined the team` }));
            //     socket.to(connectedClients[socket.id]["uid"]).emit('notification', JSON.stringify({ "msg": `You joined the team` }));
            //     break;
        }
    });

    //request for all online users
    socket.on('get-online-users', async () => {

        //replying with all online users
        let users = await OnlineUser.findAll()

        socket.emit("online-users", JSON.stringify(users))
    })


    //send notification
    socket.on('send-notification', async payload => {
        payload = JSON.parse(payload)
        await insertNotification(payload.notification, socket);
        //no need of type all going same way
        // switch (payload.type) {
        //     case 'single':
              
              
        //         break;
        //         //
        //         case 'group':
        //             await insertNotification(payload.notification, payload.type, socket);
        //             break;
                //not in use
            // case 'all':
            //     io.emit("notification", JSON.stringify({
            //         'msg': payload.msg
            //     }))
            //     break;
            // case 'some':
            //     payload['users'].forEach(u => io.to(u).emit('notification', JSON.stringify({
            //         'msg': payload.msg,
            //         'team': payload.team
            //     })));
            //     break;
          
        // }
    })

    //sending bulk notifications
    async function insertNotification(notifications,  socket) {
        let snap = await Notifications.bulkCreate(notifications);

        notifications.forEach(async item => {
            await NotificationUser.create({
                notification_id: snap[0]["dataValues"]["id"],
                user_id: item.reciever,
            
            });
            socket.to(item.reciever).emit("notification", JSON.stringify({
                'msg': item.notification,
                notification_id: snap[0]["dataValues"]["id"]

            }))
        });
        // switch (type) {
        //     case 'single':
        //         let snap = await Notifications.bulkCreate(notifications);

        //         notifications.forEach(async item => {
        //             await NotificationUser.create({
        //                 notification_id: snap[0]["dataValues"]["id"],
        //                 user_id: item.reciever,
        //                 type
        //             });
        //             socket.to(item.reciever).emit("notification", JSON.stringify({
        //                 'msg': item.notification,
        //                 notification_id: snap[0]["dataValues"]["id"]

        //             }))
        //         });
        //         break;
        //     default:
        //         let snap2 = await GroupNotifications.create(notifications)
        //         let room = await Chats.findOne({ where: { 'id': notifications.room } })
        //         socket.to(room["dataValues"]["name"]).emit("notification", JSON.stringify({
        //             'msg': notifications.notification,
        //             notification_id: snap2["dataValues"]["id"]

        //         }))
        // }
    }

    //notification is recieved
    socket.on("notification-recieve", async payload => {
        payload = JSON.parse(payload);

        await NotificationUser.update({ status: payload.status }, {
            where: {
                notification_id: payload.notificationId,
                user_id: payload.userId
            }
        })
    })


    //sending msg
    socket.on('send-message', async payload => {
        payload = JSON.parse(payload)
        let message;
        //    console.log( io.sockets.adapter.rooms)
        switch (payload.type) {
            case 'single':
                message = await Messages.create(payload.msg)
                await ChatMessage.create({
                    chat_id: payload.chat_id,
                    message_id: message["dataValues"]["id"],
                    type: payload.type,
                    status: false
                });
                socket.to(payload.room).emit('message', JSON.stringify({
                    msg: payload.msg.message,
                    chatId: payload.chat_id,
                    messageId: message["dataValues"]["id"],
                    type: payload.type
                }))
                break;
            default:
                //for group chat
                message = await GroupMessages.create(payload.msg)
                let users = await ChatUser.findAll({
                    where: {
                        chat_id: payload.chat_id
                    }
                });
                users.forEach(async user => {
                    let status = false;
                    if(user['dataValues']['user_id'] == payload.msg.sender){
                        status = true
                    }
                    await GroupChatMessage.create({
                        user_id: user['dataValues']['user_id'],
                        chat_id: payload.chat_id,
                        message_id: message['dataValues']['id'],
                        status
                    });

                })
                socket.to(payload.room).emit('message', JSON.stringify({
                    msg: payload.msg.message,
                    chatId: payload.chat_id,
                    messageId: message["dataValues"]["id"],
                    type: payload.type
                }))
        }



    });

    //update the status of message
    socket.on("message-recieve", async payload => {
        payload = JSON.parse(payload);
        switch (payload.type) {
            case 'single':
                await ChatMessage.update({ status: payload.status }, {
                    where: {
                        message_id: payload.messageId,
                        chat_id: payload.chatId
                    }
                })
                break;
            default:
                await GroupChatMessage.update({ status: payload.status }, {
                    where: {
                        message_id: payload.messageId,
                        chat_id: payload.chatId,
                        user_id: payload.userId
                    }
                })
                break;
        }

    })

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