const Chats = require("../models/chat");
const ChatUser = require("../models/chatUser");
const Messages = require("../models/message");
const User = require("../models/user");
require('../models/association')
const getChatRooms = async (req, res) => {
    try {

        let chatRooms = await User.findAll({
            where: {
                'id': req.query.id
            },
            include: "Chats",

        });
        return res.json(chatRooms[0]["Chats"])
    } catch (err) {
        return res.json(err)

    }
}
const getChats = async (req, res) => {
    try {
        let subquery = ''
       
        let chats = await Chats.findAll({
            where: {
                'id': req.query.id
            },
            include: [
                {
                    model: Messages,
                    as: "Messages",
                    
                    through:req.query.mode !== "all" ? {
                        where: {
                            'status': req.query.mode == 'pending' ? false : true
                        }
                    } : ''

                }
            ]

        })
        return res.json(chats)
    } catch (err) {
        return res.json(err)

    }
}
const getGroupChats = async (req, res) => {
    try {
        let chats = await Chats.findAll({
            where: {
                'id': req.query.id
            },
            include: "GroupMessages"
        })
        return res.json(chats)
    } catch (err) {
        return res.json(err)

    }
}
module.exports = {
    getChatRooms,
    getChats,
    getGroupChats
}