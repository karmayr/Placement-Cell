const mongoose = require('mongoose');
const { Schema } = mongoose;
const studentSchema = new mongoose.Schema({

    personalDetails: {
        fullName: { type: String, required: true },
        PRN: { type: String, required: true },
        branch: { type: String, required: true },
        year: { type: String, required: true },
        address: { type: String, required: true },
        contact: { type: String, required: true },
        email: { type: String, required: true },
        placementStatus: { type: String },
        graduatingYear: { type: String, required: true },
        profilePhoto: {
            url: String,
            filename: String
        },
        skills: { type: [String] },
        languages: { type: [String] }
    },
    entryStatus: {
        type: String,
        enum: ['Regular', 'Lateral'],
        required: true
    },
    education: {
        tenth: { type: String, required: true },
        twelfth: {
            type: String,
            required: function () { return this.entryStatus === 'Regular'; }
        },
        diploma: {
            diplomaCGPA: {
                type: Number,
                required: function () { return this.entryStatus === 'Lateral'; }
            }
        },
        latestCGPA: { type: Number, required: true },
        liveBacklog: { type: Number, required: true },
        deadBacklog: { type: Number, required: true },
        gapYear: { type: Number, required: true },
    },
    experiences:
        [
            {
                company: { type: String },
                role: { type: String },
                duration: { type: String },
                responsibilities: { type: String }
            }
        ],
    projects:
        [
            {
                projectName: { type: String },
                projectDescription: { type: String },
                projectLink: { type: String }
            }
        ],
    onlineProfiles: {
        resume: {
            url: String,
            filename: String
        },
        linkedIn: { type: String },
        gitHub: { type: String },
        twitter: { type: String }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    applied_drives: [{
        drive_id: {
            type: Schema.Types.ObjectId,
            ref: 'drive', // Reference to the Drive collection
            // required: true
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'not-applied',
        },
        applied: {
            type: Boolean,
            default: false
        },
        stage: {
            type: Number,
            default: 0
        }
    }]
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;

// certifications: [
//     {
//         certificationName: { type: String },
//         images: {
//             url: String,
//             filename: String
//         }
//     }
// ],