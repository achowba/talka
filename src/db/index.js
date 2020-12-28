const mongoose = require('mongoose');

let DB_URI = process.env.DEV_DB_URI;
if (process.env.NODE_ENV === 'production') {
    DB_URI = process.env.PROD_DB_URI;
} else if (process.env.NODE_ENV === 'test') {
    DB_URI = process.env.TEST_DB_URI;
}

function connectDB() {
    const options = {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    }

    mongoose.connect(DB_URI, options).then(() => {
        console.info('DB Connected!')
    }).catch(() => {
        throw new Error('Failed to Connect to DB');
    });
}

module.exports = connectDB;
