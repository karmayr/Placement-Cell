module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'login Required');
        return res.redirect('/login');
    }
    next();
}