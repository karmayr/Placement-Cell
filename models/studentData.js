const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const StudentDataSchema = new Schema({
    personalDetails: {
        fullName: { type: String },
        PRN: { type: String },
        branch: { type: String },
        year: { type: String },
        email: { type: String },
        contact: { type: String },
        address: { type: String },
        placementStatus: { type: String },
        profilePhoto: { type: String },
        skills: { type: [String] },
        languages: { type: [String] },
    },
    education: {
        tenth: { type: String },
        twelfth: { type: String },
        undergrad: { type: String },
        latestCGPA: { type: Number },
        liveBacklog: { type: Number },
        deadBacklog: { type: Number },
        totalBacklog: { type: Number },
        gapYear: { type: Boolean },
    },
    experience: {
        internship: [
            {
                company: { type: String },
                role: { type: String },
                duration: { type: String },
                responsibilities: { type: String },
            },
        ],
        job: [
            {
                company: { type: String },
                role: { type: String },
                duration: { type: String },
                responsibilities: { type: String },
            },
        ],
    },
    projects: [
        {
            name: { type: String },
            description: { type: String },
            link: { type: String },
        },
    ],
    certification: [
        {
            certificationName: { type: String },
            issuingAuthority: { type: String },
            dateEarned: { type: String },
        },
    ],
    links: {
        resume: { type: String },
        linkedIn: { type: String },
        github: { type: String },
        personalWebsite: { type: String },
    },
});

const StudentData = new mongoose.model('StudentData', StudentDataSchema, 'StudentData');
module.exports = StudentData;


