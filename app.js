const app = require("express")()
const httpServer = require("http").createServer(app)

const io = require("socket.io")(httpServer,{
    cors:{
        origin:'*',
        methods: ["GET", "POST"]
    }
})
const path = require("path")
const cors = require("cors")

const roomHandler = require('./handlers/joinroom.handler');
// const userRoutes = require("./src/routes/user");
const chatRoutes = require('./src/routes/chat')
const notificationRoutes = require("./src/routes/notification")
const notificationsHandler = require("./handlers/notifications.handler")
const chatsHandler = require("./handlers/chats.handler")
const allHandler = require("./handlers/all.handler")
const Notifications = require('./src/models/notification')
const NotificationUser = require("./src/models/notificationUser");
require('./src/database/connection');
require("./src/models/onlineUser");

app.use(require("express").static(path.join(__dirname, 'public')))
app.use(require("express").json())
app.use(cors({ origin: true }))
// app.use("/user", userRoutes);
app.use("/chat", chatRoutes)
app.use("/notification", notificationRoutes)




//notification via api
app.post('/data-notification', async (req, res) => {
    console.log("in send by api")
    try {
        const { payload } = req.body
        // return console.log(payload)
        let notification = []
        payload.ids.forEach(id => {
            notification.push({
                sender: payload.sender,
                reciever: id,
                msg: payload.msg,
                data: payload.data,
                type: payload.type

            })
        })
        const response = await insertNotification(notification, io)
        if (response) {
            res.status(200).json({
                success: true
            })
        } else {
            res.status(400).json({ success: false })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            err
        })
    }
})

//sending bulk notifications
async function insertNotification(notifications, io) {

    try {
        let snap = await Notifications.bulkCreate(notifications);

        notifications.forEach(async item => {

            await NotificationUser.create({
                notification_id: snap[0]["dataValues"]["id"],
                user_id: item.reciever,

            });
            io.to(`${item.reciever}`).emit("notification", JSON.stringify({
                'msg': item.msg,
                'data': item.data,
                'sender': item.sender,
                'type': item.type,
                notification_id: snap[0]["dataValues"]["id"]

            }))


        });
        return true;
    } catch (err) {
        return false
    }

}
//end of notifications


//rendering the first page
app.get("/", (req, res) => {
    res.render('index.html')
})


io.on('connection', (socket) => {
    console.log("saqib is connecting",socket)
    allHandler(io, socket)
    roomHandler(io,socket);
    notificationsHandler(io,socket);
    // chatsHandler(io,socket);
})

module.exports = {
    httpServer
}

