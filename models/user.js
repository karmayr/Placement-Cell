const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
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
    }
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);
module.exports = User;