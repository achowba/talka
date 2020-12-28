const bcrypt = require("bcrypt");
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;

const userService = new (require("./user.service"));
const serialize = require('../serializers/user.serializer');

class Auth {
    static init() {
        const options = {
            usernameField: "email",
            passReqToCallback: true
        };

        passport.use(new LocalStrategy(options, Auth.authenticateUser));

        passport.serializeUser((user, done) => {
            return done(null, serialize(user));
        });

        passport.deserializeUser((id, done) => {
            return userService.getById(id).then((user) => {
                return done(null, user);
            });
        });
    }

    static async authenticateUser(req, email, password, done) {
        try {
            const user = await userService.findOne({email});

            if (!user) {
                return done(null, false, { message: "Invalid email or password!" });
            }

            const isValid = await Auth.verifyPassword(user, password);

            if (!isValid) {
                return done(null, false, { message: "Invalid email or password!" });
            }

            user.last_login_at = new Date();
            await user.save();

            const passportSession = req.session.passport;
            req.session.regenerate((err) => {
                req.session.passport = passportSession;
                req.session.save((err) => {
                    return done(null, user);
                });
            });

        } catch (e) {
            return done(e);
        }
    }

    static async signup(payload) {
        payload.password = await this.hashPassword(payload.password);
        return userService.create(payload);
    }

    static async hashPassword(password) {
        const salt = await bcrypt.genSalt(process.env.SALT_ROUND);
        return bcrypt.hash(password, salt);
    }

    static async verifyPassword(user, password) {
        if (!password || !user.password) {
            return false;
        }

        return await bcrypt.compare(password, user.password);
    }
}

module.exports = Auth;
