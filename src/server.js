const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 1648;
const server = http.createServer(app);
require('./libraries/socket.library')(app, server);

server.listen(PORT, () => {
    console.info(`Server listening on port: ${PORT}`);
});
