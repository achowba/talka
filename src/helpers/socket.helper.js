const _ = require('lodash');
const Cache = new (require('../libraries/redis.library'));

class SocketHelper {
    getUserFromSession(socket) {
        return _.get(socket, 'handshake.session.passport.user', null);
    }

    async getUserFromCache(id) {
        const user = await Cache.get(`chat-${id}`);
        return JSON.parse(user);
    }

    async cacheConnectedUser(user, socket) {
        const cached_user = await this.getUserFromCache(user._id);
        let socket_ids = [socket.id];

        if (cached_user && cached_user.socket_ids) {
            socket_ids = [...cached_user.socket_ids, socket.id];
        }

        const connected_user = {
            _id: user._id,
            name: user.username,
            socket_ids,
        }

        return await Cache.set(`chat-${user._id}`, connected_user);
    }

    async removeSocketIdFromCache(user, socket) {
        const cached_user = await this.getUserFromCache(user._id);
        cached_user.socket_ids = cached_user.socket_ids.filter(id => id !== socket.id);

        return await Cache.set(`chat-${user._id}`, cached_user);
    }
}

module.exports = SocketHelper;
