const app = require("express")()
const httpServer = require("http").createServer(app)
const io = require("socket.io")(httpServer)
const path = require("path")
const cors = require("cors")

const roomHandler = require('./handlers/joinroom.handler');
const userRoutes = require("./src/routes/user");
const chatRoutes = require('./src/routes/chat')
const notificationRoutes = require("./src/routes/notification")
const notificationsHandler = require("./handlers/notifications.handler")
const chatsHandler = require("./handlers/chats.handler")
const allHandler = require("./handlers/all.handler")
require('./src/database/connection');
require("./src/models/onlineUser");

app.use(require("express").static(path.join(__dirname, 'public')))
app.use(require("express").json())
app.use(cors({ origin: true }))
app.use("/user", userRoutes);
app.use("/chat",chatRoutes)
app.use("/notification",notificationRoutes)

app.get("/", (req, res) => {
    res.render('index.html')
})


io.on('connection', (socket) => {
    allHandler(io,socket)
    // roomHandler(io,socket);
    // notificationsHandler(io,socket);
    // chatsHandler(io,socket);
})

httpServer.listen(5000, () => console.log("server started"))
