const Redis = require('ioredis');

class Cache {
    constructor() {
        const config = {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
        }

        this.client = new Redis(config);
    }

    /**
     * @param { String } key
     * @param { String } value
     * @param { Number } expire => milliseconds
     *
    */
    set(key, value, expire = null) {
        value = typeof value !== 'string' ? JSON.stringify(value) : value;
        // return this.client.set(key, value, 'EX', expire);
        return this.client.set(key, value);
    }

    get(key) {
        return this.client.get(key);
    }

    delete(key) {
        return this.client.del(key);
    }
}

module.exports = Cache;
