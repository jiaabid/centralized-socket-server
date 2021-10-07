const Chats = require("../models/chat");
const ChatUser = require("../models/chatUser");
const User = require("../models/user");
require('../models/association')
const getMyNotifications = async (req, res) => {
    try {

        let notifications = await User.findAll({
            where: {
                'id': req.query.id
            },
            include: "Notifications",

        });
        return res.json(notifications)
    } catch (err) {
        return res.json(err)

    }
}

module.exports = {
    getMyNotifications,
    
}