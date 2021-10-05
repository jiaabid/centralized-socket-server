const app = ['app1'];
let connectedClients = {}
const rooms = [];
module.exports = (io, socket) => {

    // console.log(io ,socket);
    app.map(el => {
        io.of(`/${el}`).on('connection', socket => {

            console.log("connected", socket.id , el);
            socket.once('hello', payload => {
                console.log(payload)
            })
            
            //join room
            socket.once("join-room", payload => {
                payload = JSON.parse(payload)
                switch (payload.mode) {
                    case 'room':
                        socket.join(payload.uid)
                        connectedClients[socket.id] = payload
                        console.log(payload.uid, "user connected");
                        //replying with all online users
                        io.of(`/${el}`).emit("online-users", JSON.stringify(connectedClients));
                        break;

                    case 'team':
                        socket.join(payload.team);
                        socket.to(payload.team).emit('notification', JSON.stringify({ "msg": `${connectedClients[socket.id]["uid"]} has joined the team` }));
                        socket.to(connectedClients[socket.id]["uid"]).emit('notification', JSON.stringify({ "msg": `You joined the team` }));
                        break;
                }
            });

            //request for all online users
            socket.on('get-online-users', async () => {

                //replying with all online users
                socket.emit("online-users", JSON.stringify(connectedClients))
            })


            //send notification
            socket.on('send-notification', payload => {
                payload = JSON.parse(payload)

                switch (payload.mode) {
                    case 'one':
                        socket.to(payload.room).emit("notification", JSON.stringify({
                            'msg': payload.msg
                        }))
                        break;
                    case 'all':
                        io.of(`/${el}`).emit("notification", JSON.stringify({
                            'msg': payload.msg
                        }))
                        break;
                    case 'some':
                        payload['users'].forEach(u => io.to(u).emit('notification', JSON.stringify({
                            'msg': payload.msg,
                            'team': 'team1'
                        })));
                        break;
                    case 'team':
                        io.of(`/${el}`).to(payload.team).emit('notification', JSON.stringify({
                            'msg': payload.msg
                        }));
                        break;
                }
            })


    //sending msg
    socket.on('send-message', payload => {
        payload = JSON.parse(payload)
        socket.to(payload.room).emit('message', payload.msg)
    });


    //on disconnect remove the user 
    socket.on("disconnect", async () => {

        //get connected sockets
        let sockets = await io.allSockets()
        let temp = {}
        let disconnectedUser;

        console.log("before", connectedClients)
        console.log(sockets)


        //filter the disconnected one
        disconnectedUser = Object.keys(connectedClients).find(el => !sockets.has(el))
        disconnectedUser = connectedClients[disconnectedUser]

        //update the connected clients
        sockets.forEach(el => {
            temp[el] = connectedClients[el]
        })
        connectedClients = temp


        console.log("after", connectedClients)
        console.log(disconnectedUser)

        //broadcast user has signout
        io.of(`/${el}`).emit("user-signout", { user: disconnectedUser })
    })


    //create the team rooms
    socket.on('create-team', async payload => {
        payload = JSON.parse(payload);
        socket.join(payload.team)
        console.log(await io.allSockets(), 'rooms')
        console.log(connectedClients[socket.id])
        io.of(`/${el}`).to(connectedClients[socket.id].uid).emit('notification', JSON.stringify({'msg':'Team created!'}))
    })

    //join team
    socket.on('join-team', payload => {
        payload = JSON.parse(payload);
        socket.join(payload.team);
    })  
        })
    })



}