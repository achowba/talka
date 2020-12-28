const Redis = require("ioredis");
const session = require('express-session');
const RedisStore = require("connect-redis")(session);

const SESS_EXPIRY = 1000 * 60 * 60 * 24; // 24 hours

const client = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    // password: "secret",
});

module.exports = session({
    // use redis to store sessions,
    store: new RedisStore({
        client,
        ttl: SESS_EXPIRY,
    }),
    name: process.env.SESSION_NAME,
    cookie: {
        maxAge: SESS_EXPIRY,
        sameSite: false,
        secure: process.env.NODE_ENV === "production",
        httpOnly: process.env.NODE_ENV === "production",
    },
    secret: process.env.SESSION_SECRET, // session secret
    resave: false,
    saveUninitialized: false, // save a session that is "uninitialized" to the store. A session is uninitialized when it is new but not modified.
});
