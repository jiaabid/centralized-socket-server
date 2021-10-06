const Chats = require("../models/chat");
const ChatUser = require("../models/chatUser");
const User = require("../models/user");
require('../models/association')
const getChatRooms = async (req, res) => {
    try {

        let chatRooms = await User.findAll({
            where: {
                'id': req.query.id
            },
            include:"Chats",
       
        });
        return res.json(chatRooms[0]["Chats"])
    } catch (err) {
        return res.json(err)

    }
}

module.exports = {
    getChatRooms
}