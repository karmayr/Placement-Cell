const mongoose = require('mongoose');
const { Schema } = mongoose;
// Define job schema
const driveSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        index: true
    },
    driveDate: {
        type: Date,
        required: true,
        index: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    eligibilityCriteria: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
        index: true
    },
    numberOfStages: {
        type: Number,
        required: true
    },
    selectionProcess: {
        type: [String],
        required: true
    },
    requiredSkills: {
        type: [String],
        required: true
    },
    contactEmail: {
        type: String,
        required: true
    },
    contactPhone: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 10
    },
    companyDescription: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "Recruiter"
    },
    appliedStudents: [{
        type: Schema.Types.ObjectId,
        ref: "Student"
    }],
    status: {
        type: String,
        enum: ["active", "deactivated", "not-started"],
        default: "not-started"
    },
    completedStages: {
        type: [String]
    },
    Events: [
        {
            eventName: { type: String },
            eventDate: { type: String },
            eventMessage: { type: String },
            status: {
                type: String,
                enum: ["Ongoing", "Completed", "Scheduled"],
                default: "Scheduled"
            },
            createdAt: { type: Date, default: Date.now }
        }
    ]
});
const drive = mongoose.model('drive', driveSchema);

module.exports = drive;
