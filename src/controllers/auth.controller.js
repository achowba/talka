const ErrorHelper = require("../helpers/error.helper");
const AuthService = require("../services/auth.service");

class AuthController {
    static async register(req, res, next) {
        try {
            const payload = req.body;
            await AuthService.signup(payload);

            res.redirect('/auth/login');
        } catch (err) {
            ErrorHelper.handleError(req, res, err);
        }
    }

    static logout(req, res, next) {
        try {
            res.clearCookie(process.env.SESSION_NAME);
            req.session.destroy();
            req.logOut();
            res.redirect('/auth/login');
        } catch (err) {
            ErrorHelper.handleError(req, res, err);
        }
    }

    static async renderLoginPage(req, res, next) {
        res.render('pages/login.ejs', { name: 'Login User' });
    }

    static async renderRegisterPage(req, res, next) {
        res.render('pages/register.ejs', { name: 'Register User' });
    }
}

module.exports = AuthController;
