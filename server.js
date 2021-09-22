const app = require("express")()
const httpServer = require("http").createServer(app)
const io = require("socket.io")(httpServer)
const path = require("path")
const cors = require("cors")
const notificationHandler = require('./handlers/notifications.handler');
const namespaceHandler = require('./handlers/namespace.handler');
const chatHandler = require('./handlers/chats.handler');
const roomHandler = require('./handlers/joinroom.handler');
app.use(require("express").static(path.join(__dirname, 'public')))

app.use(cors({ origin: true }))
let nsp = "/"
app.get("/", (req, res) => {
    nsp = req.query.nsp
    // connectSocket(nsp)
    res.render('index.html')
})

//registering dynamic namespaces
//will be retrieved from database
let apps = ["app1","app2"]

apps.map(app=>io.of(app).on('connection',(socket)=>
{
    //for joining room and team
    roomHandler(io.of(app),socket,nsp)

    //for chat
    chatHandler(io.of(app),socket,nsp)

    //for notifications
    notificationHandler(io.of(app),socket,nsp)
}));


httpServer.listen(443, () => console.log("server started"))


// io.of('/app1').on("connection",onConnection)
// io.on("connection",onConnection)

// const onConnection = (socket) => {
//     // notificationHandler(io.of('/app1'), socket);
//     // namespaceHandler(io,socket);
//     chatHandler(io,socket)
// }
// let nsp = ['app1','app2']
// nsp.map(el=> io.of(el).on("connection",onConnection));
// connectSocket(nsp)
// function connectSocket(nsp){
//     io.of(nsp).on("connection",onConnection)
// }

   // let socks = await io.allSockets() 
        // let socks = io.sockets.adapter.rooms
        // console.log(socks)
        // socks.forEach(element => {
        //     console.log(element)
        // });