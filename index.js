//*environment variables dotenv
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
//! needed imports
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const session = require("express-session");
const AppError = require("./utilities/appError");
const catchAsync = require("./utilities/catchAsync.js");
const User = require("./models/user");
const Student = require("./models/student.js");
const Drive = require("./models/drive.js");
const Recruiter = require("./models/recruiter.js");
const { storage } = require("./cloudinary/app.js");
//multer
const multer = require('multer')
// const upload = multer({ storage });
const upload = multer({ dest: "uploads/" });
const flash = require('connect-flash');

const passport = require('passport');
const passportLocal = require('passport-local');
const { isLoggedIn } = require('./utilities/middleware.js');

mongoose.connect('mongodb://127.0.0.1:27017/TestDB')
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


//? for form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
//?public directory for views
app.use(express.static(path.join(__dirname, "public")));

//? Engine for layout
app.engine("ejs", ejsMate);

//? middlewares
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", 'ejs');

//?Session 
const sessionConfig = {
    secret: process.env.SESSION__SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnlt: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

//?Passport Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//!Routes
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//* Landing page
app.get("/", (req, res) => {
    res.render('./LandingPages/index.ejs');
})

//* Student Routes and Profile Routes
app.get("/student/register", isLoggedIn, (req, res, next) => {
    res.render("./student/registerDetails.ejs");
});

// upload.single('image')
app.post("/student/register", upload.single("image"), catchAsync(async (req, res, next) => {
    const {
        personalDetails, entryStatus, education, experiences, onlineProfiles, projects
    } = req.body;
    const newStudent = new Student({
        personalDetails: personalDetails, entryStatus: entryStatus,
        education: education, experiences: experiences,
        onlineProfiles: onlineProfiles, projects: projects
    });
    // newStudent.personalDetails.profilePhoto = ({ url: req.file.path, filename: req.file.filename })
    await newStudent.save();
    req.flash('success', "student successfully registered");
    res.redirect("/");
}));

app.get('/profile/:id', catchAsync(async (req, res, next) => {
    const student = await Student.findById(req.params.id);
    res.render('./student/profile.ejs', { s: student });
}));

app.get('/profile/:id/edit', catchAsync(async (req, res, next) => {
    const student = await Student.findById(req.params.id);
    res.render("./miscellaneous/studentEditPage.ejs", { s: student });
}));

app.put('/profile/:id', upload.single('image'), catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const {
        personalDetails, entryStatus, education, experiences, onlineProfiles, projects
    } = req.body;
    const student = await Student.findByIdAndUpdate(id, {
        personalDetails: personalDetails, entryStatus: entryStatus,
        education: education, experiences: experiences,
        onlineProfiles: onlineProfiles, projects: projects
    });
    await student.save();
    req.flash('success', 'Changes made successfully');
    res.redirect(`/profile/${req.params.id}`);
}));

app.get('/quiz', (req, res, next) => {
    res.render('./miscellaneous/quiz.ejs');
});























//* Recruiter Routes
app.get('/recruiter/register', (req, res, next) => {
    res.render('./recruiter/registerRecruiter.ejs');
})
app.post('/recruiter/register', catchAsync(async (req, res, next) => {
    const { companyName, companyWebsite, companyDescription,
        recruiterName, recruiterTitle,
        recruiterPhoneNumber, recruiterEmail } = req.body;
    const newRecruiter = new Recruiter({
        companyName, companyWebsite,
        companyDescription,
        recruiterName, recruiterPhoneNumber,
        recruiterTitle, recruiterEmail
    })
    await newRecruiter.save();
    req.flash('success', 'Registration Compeleted Successfully');
    res.redirect('/');
}));

















//* Drive Routes
app.get('/drive/register', (req, res, next) => {
    res.render("./recruiter/registerDetails.ejs");
})
app.post('/drive/register', catchAsync(async (req, res, next) => {
    const { companyName, jobTitle, driveDate, requiredSkills, jobDescription,
        salaryRange, eligibilityCriteria,
        location, numberOfStages, selectionProcess, contactEmail,
        contactPhone, companyDescription } = req.body;
    spArray = selectionProcess.split(",");
    srArray = requiredSkills.split(",")
    const newDrive = new Drive({
        companyName: companyName, jobTitle: jobTitle, driveDate: driveDate,
        jobDescription: jobDescription, salary: salaryRange,
        eligibilityCriteria: eligibilityCriteria, location: location,
        numberOfStages: numberOfStages, selectionProcess: spArray,
        requiredSkills: srArray, contactEmail: contactEmail,
        contactPhone: contactPhone,
        companyDescription: companyDescription
    })
    await newDrive.save();
    req.flash('success', 'Drive created successfully');
    res.redirect("/");
}))
app.get('/drive/all', catchAsync(async (req, res, next) => {
    const drives = await Drive.find({});
    res.render("./miscellaneous/alldrives.ejs", { drives });
}))
app.get('/drive/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const currentDrive = await Drive.findById(id);
    if (!currentDrive) {
        req.flash('error', 'No Drive Exists');
        return res.redirect('/drive/all');
    }
    res.render('./recruiter/driveDetails.ejs', { currentDrive });
}));
app.get('/drive/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const drive = await Drive.findById(id);
    res.render('./recruiter/editDrive.ejs', { drive });
}));
app.put("/drive/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { companyName, jobTitle, driveDate, requiredSkills, jobDescription,
        salaryRange, eligibilityCriteria,
        location, numberOfStages, selectionProcess, contactEmail,
        contactPhone, companyDescription } = req.body;
    spArray = selectionProcess.split(",");
    srArray = requiredSkills.split(",")
    const drive = await Drive.findByIdAndUpdate(id, {
        companyName: companyName, jobTitle: jobTitle, driveDate: driveDate,
        jobDescription: jobDescription, salary: salaryRange,
        eligibilityCriteria: eligibilityCriteria, location: location,
        numberOfStages: numberOfStages, selectionProcess: spArray,
        requiredSkills: srArray, contactEmail: contactEmail,
        contactPhone: contactPhone,
        companyDescription: companyDescription
    })
    await drive.save();
    req.flash('success', 'Successfully updated');
    res.redirect(`/drive/${id}`);
}));
app.delete('/drive/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Drive.findByIdAndDelete(id);
    req.flash('success', "Drive deleted successfully");
    res.redirect('/drive/all');
}))






//* Auth Routes 
app.get('/login', (req, res, next) => {
    res.render('./auth/login.ejs');
})
app.post("/login", passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(async (req, res, next) => {
    const username = req.body.username.toUpperCase();
    req.flash('success', `Welcome to Placement Cell! ${username}`);
    res.redirect('/');
}));
app.get('/register', (req, res, next) => {
    res.render('./auth/register.ejs');
})
app.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { username, password, email, identity } = req.body;
        const newUser = new User({ username, email, identity });
        await User.register(newUser, password);
        req.login(newUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'registered successfully,Welcome');
            res.redirect('/');
        })
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));
app.get('logout', (req, res, next) => {
    req.logout();
    req.flash('success', 'Logged out successfully');
    res.redirect('/');
})





//* ADMIN Routes
app.get('/admin/all', catchAsync(async (req, res, next) => {
    let sortCriteria = req.query.sort || 'fullName'; // Default sorting criteria is by full name
    let sortOrder = req.query.order || 'asc'; // Default sorting order is ascending
    let selectedBranch = req.query.branch; // Get the selected branch from query parameters
    let selectedYear = req.query.year; // Get the selected year from query parameters
    let students = await Student.find();
    // Filtering logic for selected branch
    if (selectedBranch) {
        students = students.filter(student => student.personalDetails.branch === selectedBranch);
    }
    if (selectedYear) {
        students = students.filter(student => student.personalDetails.year === selectedYear);
    }
    // Sorting logic
    if (sortCriteria === 'fullName') {
        students.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.personalDetails.fullName.localeCompare(b.personalDetails.fullName);
            } else {
                return b.personalDetails.fullName.localeCompare(a.personalDetails.fullName);
            }
        });
    } else if (sortCriteria === 'PRN') {
        students.sort((a, b) => sortOrder === 'asc' ? a.personalDetails.PRN - b.personalDetails.PRN : b.personalDetails.PRN - a.personalDetails.PRN);
    } else if (sortCriteria === 'year') {
        students.sort((a, b) => {
            const yearMap = { 'F.Y': 1, 'S.Y': 2, 'T.Y': 3, 'L.Y': 4 };
            const yearA = yearMap[a.personalDetails.year];
            const yearB = yearMap[b.personalDetails.year];
            if (sortOrder === 'asc') {
                return yearA - yearB;
            } else {
                return yearB - yearA;
            }
        });
    }
    res.render('./admin/allStudents.ejs', { students, selectedBranch });
}));
app.get('/admin/student/:id', catchAsync(async (req, res, next) => {
    const student = await Student.findById(req.params.id)
    if (!student) {
        req.flash('error', "StudentDoesNotExist");
        return res.redirect('/admin/all');
    }
    res.render('./admin/viewStudent', { s: student });
}));

//!Error routes
app.all("*", (req, res, next) => {
    next(new AppError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something Went Wrong";
    res.status(statusCode);
    res.render("./templates/error.ejs", { err })
})
app.listen(3000, () => {
    console.log("listening on port 3000");
});