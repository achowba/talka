const socketio = require('socket.io');
const sharedSession = require('express-socket.io-session');

const session = require('./session.library');
const SocketHelper = new (require('../helpers/socket.helper'));

module.exports = function (app, server) {

    const io = socketio(server);
    app.set('socketio', io);

    io.use(sharedSession(session)); // socket.io middleware for accessing session data

    io.on('connection', async (socket) => {
        console.log('New Connection!');

        // started testing using rooms method here
        // const receiver = JSON.parse(socket.handshake.query.receiver);
        // console.log(receiver);
        // // socket.join('some room'); // ch-receiver._id

        const user = SocketHelper.getUserFromSession(socket);
        if (user) {
            await SocketHelper.cacheConnectedUser(user, socket);
        }

        socket.on('private_message', async (data) => {
            const receiver = await SocketHelper.getUserFromCache(data.receiver._id);
            console.log(data);
            console.log(receiver);

            receiver.socket_ids.forEach((id) => {
                io.to(id).emit('private_message', data);
            });
        });

        socket.on('typing', async (data) => {
            const receiver = await SocketHelper.getUserFromCache(data.receiver._id);
            console.log(data);
            console.log(receiver);

            receiver.socket_ids.forEach((id) => {
                io.to(id).emit('typing', data);
            });
        });

        socket.on('disconnect', async () => {
            if (user) {
                await SocketHelper.removeSocketIdFromCache(user, socket);
            }
        });
    });
};
