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
const Otp = require("./models/otp.js");
const PasswordReset = require("./models/passwordReset.js");
const { storage } = require("./cloudinary/app.js");
//multer
const multer = require('multer')
// const upload = multer({ storage });
const upload = multer({ dest: "uploads/" });
const flash = require('connect-flash');

const passport = require('passport');
const passportLocal = require('passport-local');
const { isLoggedIn, isRegistered } = require('./utilities/middleware.js');
const mailer = require("./utilities/mailer.js");
const { genrateOtp, otpTimeout, otpExpiryFiveMin } = require("./utilities/helper.js");
const randomString = require('randomstring');

const cron = require('node-cron');


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


//? Middleware to trim the form data
app.use((req, res, next) => {
    if (req.body && req.body.username) {
        req.body.username = req.body.username.trim();
    }
    next();
});



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

//* Landing page and Dashboards
app.get("/", (req, res) => {
    res.render('./LandingPages/index.ejs');
})

app.get('/dashboard', isLoggedIn, catchAsync(async (req, res, next) => {
    const drives = await Drive.find({});
    res.render('./LandingPages/dashboard.ejs', { drives });
}));




//* Student Routes and Profile Routes
app.get("/student/register", isLoggedIn, isRegistered, (req, res, next) => {
    res.render("./student/registerDetails.ejs");
});

// upload.single('image')
app.post("/student/register", isLoggedIn, isRegistered, upload.single("image"), catchAsync(async (req, res, next) => {
    const {
        personalDetails, entryStatus, education, experiences, onlineProfiles, projects
    } = req.body;
    const newStudent = new Student({
        personalDetails: personalDetails, entryStatus: entryStatus,
        education: education, experiences: experiences,
        onlineProfiles: onlineProfiles, projects: projects,
        author: req.user._id
    });
    // newStudent.personalDetails.profilePhoto = ({ url: req.file.path, filename: req.file.filename })
    const success = await newStudent.save();
    if (!success) {
        req.flash('error', 'There was something wrong, Try again')
        return res.redirect('/login');
    }
    req.user.registered = true;
    req.user.sID = success._id;
    req.user.save();
    req.flash('success', "student successfully registered");
    res.redirect("/dashboard");
}));

app.get('/profile/:id', isLoggedIn, catchAsync(async (req, res, next) => {
    const student = await Student.findById(req.params.id);
    res.render('./student/profile.ejs', { s: student });
}));

app.get('/profile/:id/edit', isLoggedIn, catchAsync(async (req, res, next) => {
    const student = await Student.findById(req.params.id);
    res.render("./miscellaneous/studentEditPage.ejs", { s: student });
}));


app.get('/profile/:id/add-project', isLoggedIn, catchAsync(async (req, res, next) => {
    const sid = req.params.id;
    res.render("./student/addProjects.ejs", { sid });
}));
app.post('/profile/:id/add-project', isLoggedIn, catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const project = req.body.project;
    await Student.findByIdAndUpdate(id, { $push: { projects: project } });
    res.redirect(`/profile/${req.user.sID}`);
}));


app.delete("/project/:pid/:sid/delete", catchAsync(async (req, res, next) => {
    const { pid, sid } = req.params;
    const student = await Student.findByIdAndUpdate(sid, { $pull: { projects: { _id: pid } } });
    res.redirect(`/profile/${sid}`)
}));
app.put('/profile/:id', isLoggedIn, upload.single('image'), catchAsync(async (req, res, next) => {
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

app.get('/quiz', isLoggedIn, (req, res, next) => {
    res.render('./miscellaneous/quiz.ejs');
});

app.post('/apply/:drive_id', isLoggedIn, catchAsync(async (req, res, next) => {
    const drive_id = req.params.drive_id
    const student = await Student.findByIdAndUpdate(req.user.sID, {
        $push: {
            applied_drives: {
                drive_id: drive_id,
                status: 'pending',
                applied: true,
                stage: 1
            }
        }
    })
    const drive = await Drive.findByIdAndUpdate(drive_id, { $push: { appliedStudents: student._id } });
    student.save();
    drive.save();
    req.flash('success', 'Applied for Drive')
    res.redirect(`/drive/${drive._id}`)
}));

app.get('/dashboard/applied-drives/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const student = await Student.findById(id).populate('applied_drives.drive_id');
    const drives = student.applied_drives
    res.render('./student/appliedDrives.ejs', { drives });
}));




















//* Recruiter Routes
app.get('/recruiter/register', isLoggedIn, (req, res, next) => {
    res.render('./recruiter/registerRecruiter.ejs');
})
app.post('/recruiter/register', isLoggedIn, catchAsync(async (req, res, next) => {
    const { companyName, companyWebsite, companyDescription,
        recruiterName, recruiterTitle,
        recruiterPhoneNumber, recruiterEmail } = req.body;
    const newRecruiter = new Recruiter({
        companyName, companyWebsite,
        companyDescription,
        recruiterName, recruiterPhoneNumber,
        recruiterTitle, recruiterEmail,
        author: req.user._id,
    })
    const success = await newRecruiter.save();
    if (!success) {
        req.flash('error', 'Something went wrong');
        return res.redirect('/login');
    }
    req.user.Rid = success._id;
    req.user.registered = true;
    req.user.save();
    req.flash('success', 'Registration Compeleted Successfully');
    res.redirect('/');
}));














//* Drive Routes
app.get('/drive/register', isLoggedIn, (req, res, next) => {
    res.render("./recruiter/registerDetails.ejs");
})
app.post('/drive/register', isLoggedIn, catchAsync(async (req, res, next) => {
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
        companyDescription: companyDescription,
        author: req.user._id
    })
    await newDrive.save();
    req.flash('success', 'Drive created successfully');
    res.redirect("/");
}))
app.get('/drive/all', isLoggedIn, catchAsync(async (req, res, next) => {
    const drives = await Drive.find({});
    res.render("./miscellaneous/alldrives.ejs", { drives });
}))
app.get('/drive/:id', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const currentDrive = await Drive.findById(id);
    if (!currentDrive) {
        req.flash('error', 'No Drive Exists');
        return res.redirect('/drive/all');
    }
    res.render('./recruiter/driveDetails.ejs', { currentDrive });
}));
app.get('/drive/:id/edit', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const drive = await Drive.findById(id);
    res.render('./recruiter/editDrive.ejs', { drive });
}));
app.put("/drive/:id", isLoggedIn, catchAsync(async (req, res, next) => {
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
app.delete('/drive/:id', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Drive.findByIdAndDelete(id);
    req.flash('success', "Drive deleted successfully");
    res.redirect('/drive/all');
}))






//* Auth Routes 
app.get('/login', (req, res, next) => {
    res.render('./auth/login.ejs');
})
app.post("/login",
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    catchAsync(async (req, res, next) => {
        if (req.user.registered === true) {
            return res.redirect('/dashboard');
        } else if (req.user.registered === false && req.user.identity === 'student') {
            req.flash('success', 'Have to Complete registration first.');
            return res.redirect('/student/register');
        } else if (req.user.registered === false && req.user.identity === 'recruiter') {
            req.flash('success', 'Have to Complete registration first.');
            return res.redirect('/recruiter/register');
        }
        res.redirect('/');
    }));
app.get('/register', (req, res, next) => {
    res.render('./auth/register.ejs');
})
app.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { username, password, confirmPassword, email, identity } = req.body;
        if (password != confirmPassword) {
            data = req.body;
            req.flash('error', 'Passwords do not match');
            res.redirect('/register', { data })
        }

        const newUser = new User({ username, email, identity });
        await User.register(newUser, password);
        req.login(newUser, (err) => {
            if (err) return next(err);
            const { identity } = req.user;
            if (identity === 'student') {
                req.flash('success', "Completing the registration");
                return res.redirect('/student/register');
            } else if (identity === 'recruiter') {
                req.flash('success', "Completing the registration");
                return res.redirect('/recruiter/register');
            }
            req.flash('success', 'registered successfully,Welcome');
            res.redirect('/');
        })
    }
    catch (e) {
        if (e.code === 11000 && e.keyPattern.email) {
            req.flash('error', 'User with email address already exits, Try Forgot Password')
            return res.redirect('/login');
        }
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
    });
    req.flash('success', 'Logged out successfully');
    res.redirect('/');
})


app.get('/forgot-password', (req, res) => {
    res.render('./auth/forgotPassword')
});
app.post('/forgot-password', catchAsync(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        req.flash('error', 'No user with the email');
        return res.redirect("/login");
    }
    const token = randomString.generate();

    subject = 'Reset Password'
    content = `<p>To reset your password, <a href="http://localhost:3000/reset-password?token=${token}">Click Here</a></p>`

    await PasswordReset.deleteMany({ user_id: user._id })
    const passReset = new PasswordReset({
        user_id: user._id,
        token: token
    })
    await passReset.save();
    mailer.sendMail(email, subject, content);
    req.flash('success', 'Email sent For Changing Password');
    res.redirect('/login');

}));
app.get('/reset-password', catchAsync(async (req, res, next) => {

    if (req.query.token == undefined) {
        next(new AppError('Page Not Found', 404));
    }
    const Data = await PasswordReset.findOne({ token: req.query.token })
    if (!Data) {
        next(new AppError('Page Not Found', 404));
    }
    res.render('./auth/resetPassword.ejs', { Data })
}));


app.post('/reset-password', catchAsync(async (req, res, next) => {
    const { user_id, password, cpassword } = req.body;
    const Data = await PasswordReset.findOne({ user_id })
    if (password != cpassword) {
        return res.render('./auth/resetPassword', { Data, message: 'not-match' })
    }

    const user = await User.findOne({ _id: user_id });
    user.setPassword(password, () => {
        user.save();
    })
    await PasswordReset.deleteMany({ user_id });
    req.flash('success', "password changed successfully");
    res.redirect('/login')

}));


app.post('/send-otp', catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const userInfo = await User.find({ email });
    if (!userInfo) {
        req.flash('error', 'No user with email');
        req.logout();
        res.redirect('/login');
    }
    if (userInfo.isVerified === true) {
        req.flash('success', 'Email already verified');
        return res.redirect('/');
    }

    const otp = await genrateOtp();

    const oldOtp = await Otp.findOne({ user_id: req.user._id })

    if (oldOtp) {
        const sendNewOtp = await otpTimeout(oldOtp.timestamp);
        if (!sendNewOtp) {
            req.flash('error', 'Too many requests, Wait for sometime');
            return res.redirect('/');
        }
    }
    const currentDate = new Date();
    await Otp.findOneAndUpdate(
        { user_id: req.user._id },
        { otp, timestamp: currentDate.getTime() },
        { upsert: true, new: true, setDefaultsOnInsert: true },
    )

    subject = 'otp verification';
    content = '<p>This is the Otp <b>' + otp + '</b></p>';
    mailer.sendMail(email, subject, content);
    req.flash('success', 'OTP send to the registered user email address');
    res.redirect('/verify-otp');
}));

app.get('/verify-otp', (req, res) => {
    res.render('./auth/verifyOtpEmail.ejs');
})
app.post('/verify-otp', catchAsync(async (req, res, next) => {
    const { otp } = req.body;
    if (!otp) {
        req.flash('error', "OTP is required")
        return res.redirect('/verify-otp');
    }
    const checkOtp = await Otp.findOne({
        user_id: req.user._id,
        otp: otp,
    })
    if (!checkOtp) {
        req.flash('error', "wrong Otp");
        return res.redirect('/');
    }
    const expired = await otpExpiryFiveMin(checkOtp.timestamp);
    if (expired) {
        req.flash('error', "Otp has Expired!");
        return res.redirect('/');
    }
    req.user.isVerified = true;
    req.user.save();
    req.flash('success', "Email Verified Successfully");
    res.redirect('/')
}));







//! Using Node Cron to delete the users which do not verify their email within 3 days
// Schedule task to run daily at midnight
// ? the format is MIN HOURS Day MOnth Week
cron.schedule('0 0 * * *', async () => {
    try {
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
        await User.deleteMany({ isVerified: false, createdAt: { $lt: threeDaysAgo } });
    } catch (err) {
        console.error('Error deleting accounts:', err);
    }
});
//!



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