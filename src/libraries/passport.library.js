const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;

class PassportLib {
    constructor() {
        this.options = {
            usernameField: 'email',
            passReqToCallback: true,
        }
    }

    setStrategy(options = {}, authFunc) {
        options = {
            ...this.options,
            ...options,
        }
        passport.use(new LocalStrategy(options, authFunc));
    }

    serializeUser() {
        passport.serializeUser((user, done) => {
            return done(null, user.id);
        });
    }

    deserializeUser() {
        passport.deserializeUser((user, done) => {
            return done(null, user);
        });
    }
}

module.exports = PassportLib;
