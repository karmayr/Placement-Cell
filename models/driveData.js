const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// const eligibilitySchema = new Schema({
//     cgpa: { type: Number, required: true },
//     year: { type: Number, required: true },
//     branch: { type: String, required: true },
//     other: [String],
// });

const contactSchema = new Schema({
    email: { type: String, required: true },
    number: { type: String, required: true },
});

const jobSchema = new Schema({
    companyName: { type: String, required: true, index: true },
    driveDate: { type: Date, required: true, index: true },
    // jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    jobCriteria: { type: String, required: true },
    salary: { type: String, required: true },
    // eligibilityCriteria: { type: eligibilitySchema, required: true },
    eligibilityCriteria: { type: String, required: true },
    location: { type: String, required: true, index: true },
    selectionProcess: { type: [String], required: true },
    skillsRequired: { type: [String], required: true },
    internshipOpportunities: { type: String },
    contactInformation: { type: contactSchema, required: true },
    companyDescription: { type: String, required: true },
}, {
    // strict: 'throw', // Throw errors for any undefined fields
    timestamps: true, // Add createdAt and updatedAt fields
});

// jobSchema.index({ companyName: 1, driveDate: 1, location: 1 });


const driveData = new mongoose.model('DriveData', jobSchema, 'DriveData');
module.exports = driveData;