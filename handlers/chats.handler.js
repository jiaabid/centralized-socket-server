const ChatUser = require("../src/models/chatUser");
const Messages = require("../src/models/message");
const ChatMessage = require("../src/models/chatMessage");
const GroupMessages = require("../src/models/groupMessage");
const GroupChatMessage = require("../src/models/groupChatMessage");

module.exports = (io, socket) => {
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
                    if (user['dataValues']['user_id'] == payload.msg.sender) {
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


}