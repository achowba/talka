const socketio = require('socket.io');
const redisAdapter = require('socket.io-redis');
const sharedSession = require('express-socket.io-session');

const session = require('./session.library');
const socketHelper = new (require('../helpers/socket.helper'));

module.exports = function (app, server) {

    const io = socketio(server, {
        cors: {
            origin: "https://9e48627ce070.ngrok.io",
            methods: ["GET", "POST"]
        }
    });
    io.use(sharedSession(session)); // socket.io middleware for accessing session data
    io.adapter(redisAdapter({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }));
    // app.set('socketio', io);

    io.on('connection', async (socket) => {
        console.log('New Connection!');

        let user = socketHelper.getUserFromSession(socket);
        const receiver = await socketHelper.getUserFromDB(socket.handshake.query.receiver);
        const room = await socketHelper.createRoom(user, receiver);
        socket.room = room;

        socketHelper.joinRoom(socket, room);

        if (user) {
            user.status = 'online';
            let active_users = await socketHelper.addActiveUser(user, socket);
            io.emit('active_users', active_users);

            socket.on('private_message', async (data) => {
                socket.to(socket.room.rid).emit('private_message', data);
            });

            socket.on('typing', async (data) => {
                socket.to(socket.room.rid).emit('typing', data);
            });

            socket.on('disconnect', async () => {
                await socketHelper.removeSocketIdFromCache(user, socket);
                user.status = 'offline';
                io.emit('active_users', await socketHelper.removeInactiveUser(user));
            });
        }
    });
};
