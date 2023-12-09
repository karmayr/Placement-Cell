const Joi = require('joi');

const eligibilitySchema = Joi.object({
    cgpa: Joi.number().required(),
    year: Joi.number().required(),
    branch: Joi.string().required(),
    other: Joi.array().items(Joi.string()),
});

const contactSchema = Joi.object({
    email: Joi.string().required(),
    number: Joi.string().required(),
});

module.exports.jobDriveSchema = Joi.object({
    companyName: Joi.string().required(),
    driveDate: Joi.date().required(),
    jobDescription: Joi.string().required(),
    jobCriteria: Joi.string().required(),
    salary: Joi.number().required(),
    eligibilityCriteria: eligibilitySchema.required(),
    location: Joi.string().required(),
    selectionProcess: Joi.array().items(Joi.string()).required(),
    skillsRequired: Joi.array().items(Joi.string()).required(),
    internshipOpportunities: Joi.boolean().required(),
    contactInformation: contactSchema.required(),
    companyDescription: Joi.string().required(),
}).options({
    abortEarly: false, // Return all errors, not just the first one encountered
    allowUnknown: true, // Allows any unknown keys to pass validation
    stripUnknown: true, // Removes unknown keys from objects
});



const internshipSchema = Joi.object({
    company: Joi.string(),
    role: Joi.string(),
    duration: Joi.string(),
    responsibilities: Joi.string(),
});

const jobSchema = Joi.object({
    company: Joi.string(),
    role: Joi.string(),
    duration: Joi.string(),
    responsibilities: Joi.string(),
});

const projectSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    link: Joi.string(),
});

const certificationSchema = Joi.object({
    certificationName: Joi.string(),
    issuingAuthority: Joi.string(),
    dateEarned: Joi.string(),
});

const linksSchema = Joi.object({
    resume: Joi.string(),
    linkedIn: Joi.string(),
    github: Joi.string(),
    personalWebsite: Joi.string(),
});

module.exports.joiStudentDataSchema = Joi.object({
    personalDetails: Joi.object({
        fullName: Joi.string(),
        PRN: Joi.string(),
        branch: Joi.string(),
        year: Joi.string(),
        email: Joi.string(),
        contact: Joi.string(),
        address: Joi.string(),
        placementStatus: Joi.string(),
        profilePhoto: Joi.string(),
        skills: Joi.array().items(Joi.string()),
        languages: Joi.array().items(Joi.string()),
    }),
    education: Joi.object({
        tenth: Joi.string(),
        twelfth: Joi.string(),
        undergrad: Joi.string(),
        latestCGPA: Joi.number(),
        liveBacklog: Joi.number(),
        deadBacklog: Joi.number(),
        totalBacklog: Joi.number(),
        gapYear: Joi.boolean(),
    }),
    experience: Joi.object({
        internship: Joi.array().items(internshipSchema),
        job: Joi.array().items(jobSchema),
    }),
    projects: Joi.array().items(projectSchema),
    certification: Joi.array().items(certificationSchema),
    links: linksSchema,
});


