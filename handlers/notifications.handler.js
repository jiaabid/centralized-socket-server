module.exports = (io, socket, nsp) => {


    //send notification
    socket.on('send-notification', payload => {
        payload = JSON.parse(payload)

        switch (payload.mode) {

            //one to one notifications
            case 'one':
                socket.to(payload.room).emit("notification", JSON.stringify({
                    'msg': payload.msg
                }))
                break;

            //system notifications
            case 'all':
                io.emit("notification", JSON.stringify({
                    'msg': payload.msg
                }))
                break;

            //notifications for particular users ::requesting teams for challenge
            case 'some':
                payload['users'].forEach(u => io.to(u).emit('notification', JSON.stringify({
                    'msg': payload.msg,
                    'team': 'team1'
                })));
                break;

            //notifications for particular teams
            case 'team':
                io.to(payload.team).emit('notification', JSON.stringify({
                    'msg': payload.msg
                }));
                break;
        }
    });
}