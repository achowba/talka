const _ = require('lodash');
const userSerializer = require('../serializers/user.serializer');
const roomService = new (require('../services/room.service'));
const userService = new (require('../services/user.service'));
const Cache = new (require('../libraries/redis.library'));

class SocketHelper {
    getUserFromSession(socket) {
        return _.get(socket, 'handshake.session.passport.user', null);
    }

    async getUserFromDB(id) {
        const user = await userService.getById(id);
        return userSerializer(user);
    }

    async getUserFromCache(id) {
        const user = await Cache.get(`chat-${id}`);
        return JSON.parse(user);
    }

    async getActiveUsers() {
        const users = await Cache.get('connected-users');
        return JSON.parse(users);
    }

    // socket ids
    async cacheConnectedUser(user, socket) {
        user.socket_ids = await this.getSocketIds(user, socket);
        await Cache.set(`chat-${user._id}`, user);
        return user;
    }

    async getSocketIds(user, socket) {
        const cached_user = await this.getUserFromCache(user._id);
        let socket_ids = [socket.id];

        if (cached_user && cached_user.socket_ids) {
            socket_ids = [...cached_user.socket_ids, socket.id];
        }

        return socket_ids;
    }

    async addActiveUser(user, socket) {
        user = await this.cacheConnectedUser(user, socket);
        let users = await this.getActiveUsers();
        if (!users) users = [];

        users = users.filter(i => i._id !== user._id); // come back here (efficient way to update lists of users)
        users.push(user);

        await Cache.set(`connected-users`, users);
        return users;
    }

    async removeInactiveUser(user) {
        let users = await this.getActiveUsers();
        user = await this.getUserFromCache(user._id);
        users = users.filter(i => i._id !== user._id);
        users.push();
        console.log(users);
        return users;
    }

    async removeSocketIdFromCache(user, socket) {
        const cached_user = await this.getUserFromCache(user._id);
        cached_user.socket_ids = cached_user.socket_ids.filter(id => id !== socket.id);

        await Cache.set(`chat-${user._id}`, cached_user);
        return cached_user;
    }

    // rooms
    async createRoom(sender, receiver) {
        const existing_room = await this.getRoom(sender, receiver);

        if (!existing_room) {
            const room = {
                participants: [sender._id, receiver._id],
                type: 'private',
                sender: sender._id,
                receiver: receiver._id,
            }

            return await roomService.create(room);
        }

        return existing_room;
    }

    async getRoom(sender, receiver) {
        const filters = {
            '$and': [
                {
                    '$or': [
                        { 'sender': sender._id },
                        { 'receiver': sender._id },
                    ],
                },
                {
                    '$or': [
                        { 'sender': receiver._id },
                        { 'receiver': receiver._id },
                    ],
                },
                {
                    'participants': {
                        $in: [sender._id, receiver._id]
                    }
                }
            ]
        }

        const room = await roomService.get(filters);
        return room[0];
    }

    async cacheRoom(room) {
        return await Cache.set(room.rid, room);
    }

    joinRoom(socket, room) {
        socket.join(room.rid)
    }
}

module.exports = SocketHelper;
