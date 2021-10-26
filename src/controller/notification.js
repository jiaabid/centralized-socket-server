const { Op } = require('sequelize');
const Chats = require("../models/chat");
const ChatUser = require("../models/chatUser");
const User = require("../models/user");
const Notifications = require('../models/notification')
const UserNotifications = require('../models/notificationUser')
require('../models/association')
const getMyNotifications = async (req, res) => {
    try {

        //with user table
        // let notifications = await User.findAll({
        //     where: {
        //         'id': req.query.id
        //     },
        //     include: "Notifications",

        // });
        // return res.json(notifications)

        //without user table
        let ids = [];
        let notificationIds = await UserNotifications.findAll({
            where: {
                user_id: req.query.id
            },
            attributes: ['notification_id']
        })

        //single out the notification ids
        notificationIds.forEach(element => {
            ids.push(element['dataValues']['notification_id'])
        });

        //retrieve all notifications on basis of extracted chat user ids
        let notifications = await Notifications.findAll({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        })
        

        return res.status(200).json({
            status: true,
            payload: notifications
        });
    } catch (err) {
        return res.json({
            status: false,
            payload: err
        })

    }
}

module.exports = {
    getMyNotifications,

}