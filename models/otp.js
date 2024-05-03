const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    otp: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
        get: (timestamp) => timestamp.getTime(),
        set: (timestamp) => new Date(timestamp)
    }
});

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;