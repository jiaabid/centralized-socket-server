let connectedClients = {}
let clients = [];

module.exports = (io, socket, nsp) => {

    clients.push({
        "namespace": nsp,
        "connectedClients": connectedClients
    })
    let mynsp = clients.find(el => el.namespace == nsp)

    //join room
    socket.on("join-room", payload => {
        payload = JSON.parse(payload)
        switch (payload.mode) {
            case 'room':
                socket.join(payload.uid)
                mynsp.connectedClients[socket.id] = payload
                console.log(payload.uid, "user connected");
                //replying with all online users
                io.emit("online-users", JSON.stringify(mynsp.connectedClients));
                break;

            case 'team':
                socket.join(payload.team);
                io.to(payload.team).emit('notification', JSON.stringify({ "msg": `${mynsp.connectedClients[socket.id]["uid"]} has joined the team` }));
                socket.to(mynsp.connectedClients[socket.id]["uid"]).emit('notification', JSON.stringify({ "msg": `You joined the team` }));
                break;
        }
    });

    //on disconnect remove the user 
    socket.on("disconnect", async () => {

        //get connected sockets
        let sockets = await io.allSockets()
        let temp = {}
        let disconnectedUser;

        console.log("before", mynsp.connectedClients)
        console.log(sockets)


        //filter the disconnected one
        disconnectedUser = Object.keys(mynsp.connectedClients).find(el => !sockets.has(el))
        // console.log(disconnectedUser);
        disconnectedUser = mynsp.connectedClients[disconnectedUser]

        //update the connected clients
        sockets.forEach(el => {
            temp[el] = mynsp.connectedClients[el]
        })
        mynsp.connectedClients = temp


        console.log("after", mynsp.connectedClients)
        console.log(disconnectedUser)

        //broadcast user has signout
        io.emit("user-signout", { user: disconnectedUser })
    })


    //create the team rooms
    socket.on('create-team', async payload => {
        payload = JSON.parse(payload);
        socket.join(payload.team)
        console.log(await io.allSockets(), 'rooms')
        console.log(mynsp.connectedClients[socket.id])
        io.to(mynsp.connectedClients[socket.id].uid).emit('notification', JSON.stringify({ 'msg': 'Team created!' }))
    });

    //join team
    socket.on('join-team', payload => {
        payload = JSON.parse(payload);
        socket.join(payload.team);
    });
}