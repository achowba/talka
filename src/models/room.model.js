const mongoose = require('mongoose');

const { TYPES } = require('../constants/room.contants');

const roomSchema = new mongoose.Schema({
    rid: { type: String, default: null, },
    name: { type: String, trim: true, default: null },
    participants: { type: [String], required: true },
    type: { type: String, enum: TYPES, required: true, default: 'private' },
    sender: { type: mongoose.Types.ObjectId, required: true, },
    receiver: { type: mongoose.Types.ObjectId, required: true, },
    meta: { type: Object, required: false, default: {} },
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('Room', roomSchema, 'rooms');
