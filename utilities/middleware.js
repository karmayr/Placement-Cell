module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'login Required');
        return res.redirect('/login');
    }
    next();
}
module.exports.isRegistered = (req, res, next) => {
    if (req.user.identity === 'student' && req.user.registered === true) {
        req.flash('error', 'Already Registered, Go to Profile to edit any information');
        return res.redirect('/dashboard');
    }
    if (req.user.identity !== 'student') {
        req.flash('error', "Sorry You are not a Student,Contact Admin if you are");
        return res.redirect('/dashboard');
    }
    next();
}
