const Notifications = require("../src/models/notification");
const NotificationUser = require("../src/models/notificationUser");


module.exports = (io, socket) => {


      //send notification
      socket.on('send-notification', async payload => {
        payload = JSON.parse(payload)
        await insertNotification(payload.notification, socket);
    
    })

    //sending bulk notifications
    async function insertNotification(notifications, socket) {
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


}