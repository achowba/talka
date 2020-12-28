const isAuth = (req, res, next) => {
    // redirect user to login page if user is not logged in
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/auth/login');
    }
}

const isNotAuth = (req, res, next) => {
    // redirect user to home page if user is already logged in
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        next();
    }
}

module.exports = {
    isAuth,
    isNotAuth
}