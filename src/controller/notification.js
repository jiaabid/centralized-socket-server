const { Op, JSON } = require('sequelize');
const Chats = require("../models/chat");
const ChatUser = require("../models/chatUser");
// const User = require("../models/user");
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

const sendByApi = async (io,body) => {
        // console.log("in send by api")
        // try {
        //     const { payload } = body
        //     // return console.log(payload)
        //     let notification = []
        //     payload.ids.forEach(id => {
        //         notification.push({
        //             sender: payload.sender,
        //             reciever: id,
        //             msg: payload.msg,
        //             data: payload.data,
        //             type: payload.type
    
        //         })
        //     })
        //     const response = await insertNotification(notification, io)
        //    return response;
        //     // if (response) {
        //     //     res.status(200).json({
        //     //         success: true
        //     //     })
        //     // } else {
        //     //     res.status(400).json({ success: false })
        //     // }
        // } catch (err) {
        //  return err
        // }
    
}

//sending bulk notifications
// async function insertNotification(notifications, io) {

//     try {
//         let snap = await Notifications.bulkCreate(notifications);

//         notifications.forEach(async item => {

//             await UserNotifications.create({
//                 notification_id: snap[0]["dataValues"]["id"],
//                 user_id: item.reciever,

//             });
//             io.to(`${item.reciever}`).emit("notification", JSON.stringify({
//                 'msg': item.msg,
//                 'data': item.data,
//                 'sender': item.sender,
//                 'type': item.type,
//                 notification_id: snap[0]["dataValues"]["id"]

//             }))


//         });
//         return true;
//     } catch (err) {
//         return false
//     }

// }

module.exports = {
    getMyNotifications,
    sendByApi

}