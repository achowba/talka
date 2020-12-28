class ErrorHelper {
    static handleError(req, res, err, status_code = 400) {
        /* if (err.errors) {
            status_code = err.errors.status_code;
        } */

        status_code = err.status_code || status_code;
        // req.flash('info', err.message);
        res.status(status_code).json({
            status_code,
            success: false,
            message: err.message,
        });

        console.log(`------------------------------An Error Occured------------------------------\n`);
        console.error(err);
        console.log(`\n----------------------------------------------------------------------------`);
    }

    static error_bad_request(message = 'Bad Request!') {
        const err = new Error(message);
        err.status_code = 400;
        throw err;
    }

    static unauthorized(message = 'You are not allowed to access this resource!') {
        const err = new Error(message);
        err.status_code = 401;
        throw err;
    }

    static error_not_found(message = 'Resource doesn\'t exist!') {
        const err = new Error(message);
        err.status_code = 404;
        throw err;
    }

    static error_unprocessable_entity(message = 'Input validation failed!') {
        const err = new Error(message);
        err.status_code = 422;
        throw err;
    }

    static error_server_error(message = 'Internal Server Error!') {
        const err = new Error(message);
        err.status_code = 500;
        throw err;
    }
}

module.exports = ErrorHelper;
