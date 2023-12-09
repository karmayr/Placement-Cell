const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const ejsMate = require('ejs-mate');
const session = require("express-session");
const studentData = require("./models/studentData");
const Drive = require('./models/driveData');
const catchAsync = require('./utils/catchAsync')
const AppError = require('./utils/appError')
const Joi = require('joi');
const { request } = require('http');


//Mongo Connection to Database
mongoose.connect('mongodb://127.0.0.1:27017/FYProjectDemo1')
    .then(() => {
        console.log("Database active");
    }
    ).catch(() => {
        console.log("check database error");
    });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once("open", () => {
    console.log("connected");
})
//



//for form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));
//



//for templates
app.engine('ejs', ejsMate)
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", 'ejs');
//




//? Routes
app.get('/', (req, res) => {
    res.render('LandingPages/homepage');
})

app.get("/login", (req, res, next) => {
    res.render("Auth/loginForm.ejs");
})
app.get('/register', (req, res, next) => {
    res.render("Auth/registerForm.ejs");
})




app.get('/student/register', (req, res, next) => {
    res.render('forms/studentRegistrationForm.ejs');
})
app.post('/student', catchAsync(async (req, res, next) => {
    console.log(req.body);
    res.send(req.body);
}));




app.get('/drive', catchAsync(async (req, res, next) => {
    const drives = await Drive.find({});
    res.render("./Drive/allDrives.ejs", { drives });
}))
app.get('/drive/create', (req, res, next) => {
    res.render("./forms/driveregistration");
})
app.get('/drive/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const drive = await Drive.findById(id);
    res.render("./Drive/showDrive.ejs", { drive });
}))


app.post('/drive', catchAsync(async (req, res, next) => {
    const { companyName, driveDate, jobDescription,
        jobCriteria, salaryRange, eligibilityCriteria,
        location, selectionProcess, skillsRequired,
        internshipOpportunities, contactEmail,
        contactNumber, companyDescription } = req.body;
    spArray = selectionProcess.split(",");
    srArray = skillsRequired.split(",")
    const newDrive = new Drive({
        companyName: companyName, driveDate: driveDate, jobDescription: jobDescription,
        jobCriteria: jobCriteria, salary: salaryRange, eligibilityCriteria: eligibilityCriteria,
        location: location, selectionProcess: spArray, skillsRequired: srArray,
        internshipOpportunities: internshipOpportunities, contactInformation: { email: contactEmail, number: contactNumber },
        companyDescription: companyDescription
    })
    await newDrive.save();
    res.redirect("/");
}))






app.all("*", (req, res, next) => {
    next(new AppError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something Went Wrong";
    res.status(statusCode);
    res.render("./templates/error.ejs", { err })
})


app.listen(3000, () => {
    console.log('listening on port 3000');
})