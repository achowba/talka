require("dotenv").config();

require('./db')();

const helmet = require("helmet");
const express = require("express");
const passport = require("passport");
const flash = require("express-flash");

const app = express();
const AuthService = require('./services/auth.service');
const session = require('./libraries/session.library');

AuthService.init();

app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(session);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// app routes
app.use("/", require("./routes/index"));

// handle 404 errors
app.use((req, res, next) => {
    const err = new Error("Not found");
    err.status_code = 404;
    err.message = `Not found! 💔`;

    next(err);
});

// catch errors
app.use((err, req, res, next) => {
    const status_code = err.status_code || 500;

    // req.flash('info', err.message);
    res.status(status_code).send({
        status_code,
        success: false,
        message: err.message || "Bad request!",
    });
});

module.exports = app;
