/* const active_user = {
    _id: user._id,
    name: user.username,
    socket_ids: [socket.id],
}

cached_user = await Cache.get(`chat-${user._id}`);
// cached_user = JSON.parse(cached_user);
// cached_user.socket_ids.push(socket.id);

console.log('Old Socket IDs', JSON.parse(cached_user).socket_ids);
console.log('New Socket IDs', active_user.socket_ids);

await Cache.set(`chat-${user._id}`, active_user); */

// const user = _.get(socket, 'handshake.session.passport.user', null);

/* socket.on('disconnect', async () => {
    if (user) {
        cached_user = await Cache.get(`chat-${user._id}`);
        cached_user = JSON.parse(cached_user);
        cached_user.socket_ids = cached_user.socket_ids.filter(id => id !== socket.id);

        console.log('///////////////////////////');
        console.log(cached_user.socket_ids);
        console.log('///////////////////////////');

        await Cache.set(`chat-${user._id}`, cached_user);
        // await Cache.delete(active_user._id);
    }
}); */
