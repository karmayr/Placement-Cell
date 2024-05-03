const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    registered: {
        type: Boolean,
        default: false
    },
    identity: {
        type: String,
        enum: ['student', 'admin', 'recruiter'],
        required: true
    },
    sID: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
    },
    Rid: {
        type: Schema.Types.ObjectId,
        ref: 'recruiter',
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);
module.exports = User;