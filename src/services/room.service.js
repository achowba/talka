const { v4: uuidv4 } = require('uuid');

const Service = require('./index');
const Room = require('../models/room.model');

class RoomService extends Service {
    constructor() {
        super(Room)
    }

    async create(payload) {
        payload.rid = uuidv4();
        return await this.model.create(payload);
    }

    async get(filters = {}, options = {}) {
        return super.get(filters, options);
    }
}

module.exports = RoomService;
