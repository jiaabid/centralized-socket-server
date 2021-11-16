const { Op } = require('sequelize');
const Chats = require("../models/chat");
const ChatUser = require("../models/chatUser");
const Messages = require("../models/message");
const chatMessage = require('../models/chatMessage');
const groupChatMessage = require('../models/groupChatMessage');
const groupMessage = require('../models/groupMessage')
// const User = require("../models/user");
require('../models/association')
const getChatRooms = async (req, res) => {
    try {

        //old:when users were saved in user table
        // let chatRooms = await User.findAll({
        //     where: {
        //         'id': req.query.id
        //     },
        //     include: "Chats",

        // });
        // return res.json(chatRooms[0]["Chats"])

        //without user table
        let ids = [];
        let chatIds = await ChatUser.findAll({
            where: {
                user_id: req.query.id
            },
            attributes: ['chat_id']
        })

        //single out the chat ids
        chatIds.forEach(element => {
            ids.push(element['dataValues']['chat_id'])
        });

        //retrieve all chatrooms on basis of extracted chat user ids
        let chatRooms = await Chats.findAll({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        })
        return res.status(200).json({
            status: true,
            payload: chatRooms
        });
    } catch (err) {
        return res.json({
            status: false,
            payload: err
        })

    }
}
const getChats = async (req, res) => {
    try {
        // let subquery = ''

        // let chats = await Chats.findAll({
        //     where: {
        //         'id': req.query.id
        //     },
        //     include: [
        //         {
        //             model: Messages,
        //             as: "Messages",

        //             through: req.query.mode !== "all" ? {
        //                 where: {
        //                     'status': req.query.mode == 'pending' ? false : true
        //                 }
        //             } : ''

        //         }
        //     ]

        // })
        // return res.json(chats)

        //without user table
        let ids = [];
        let chatIds = await chatMessage.findAll({
            where: {
                chat_id: req.query.id
            },
            attributes: ['message_id'],
            where: req.query.mode !== "all" ? { 'status': req.query.mode == 'pending' ? false : true } : ''
        });

        //single out the chat ids
        chatIds.forEach(element => {
            ids.push(element['dataValues']['message_id'])
        });

        const message = await Messages.findAll({
            where: {
                id: {
                    [Op.in]: ids
                },
            },

        });

        return res.status(200).json({
            status: true,
            payload: message
        })
    } catch (err) {
        return res.json({
            status: false,
            payload: err
        })

    }
}
const getGroupChats = async (req, res) => {
    try {
        // let chats = await Chats.findAll({
        //     where: {
        //         'id': req.query.id
        //     },
        //     include: "GroupMessages"
        // })
        // return res.json(chats)
        //without user table
        let ids = [];
        let chatIds = await groupChatMessage.findAll({
            where: {
                chat_id: req.query.id
            },
            attributes: ['message_id'],
            where: req.query.mode !== "all" ? { 'status': req.query.mode == 'pending' ? false : true } : ''
        });

        //single out the chat ids
        chatIds.forEach(element => {
            ids.push(element['dataValues']['message_id'])
        });

        const message = await groupMessage.findAll({
            where: {
                id: {
                    [Op.in]: ids
                },
            },

        });

        return res.status(200).json({
            status: true,
            payload: message
        })
    } catch (err) {
        return res.json({
            status: false,
            payload: err
        })

    }
}
module.exports = {
    getChatRooms,
    getChats,
    getGroupChats
}