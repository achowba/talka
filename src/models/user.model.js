const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, trim: true, lowercase: true, required: true, },
    email: { type: String, trim: true, unique: true, lowercase: true, required: true, },
    dob: { type: Date, default: null, },
    password: { type: String, minLength: 6, required: true, },
    friends: { type: [String], default: [], },
    // requests_sent: { },
    // requests_received: { },
    last_login_at: { type: Date, default: null, },
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('User', userSchema, 'users');
