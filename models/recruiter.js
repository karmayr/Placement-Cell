const mongoose = require('mongoose');
const { Schema } = mongoose;
const recruiterSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    companyWebsite: {
        type: String,
        required: true
    },
    companyDescription: {
        type: String,
        required: true
    },
    recruiterName: {
        type: String,
        required: true
    },
    recruiterTitle: {
        type: String,
        required: true
    },
    recruiterEmail: {
        type: String,
        required: true,
        unique: true
    },
    recruiterPhoneNumber: {
        type: String,
        required: true
    },
    companyPhoto: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Recruiter = mongoose.model('Recruiter', recruiterSchema);

module.exports = Recruiter;
