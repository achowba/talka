const EMAIL_FROM = process.env.EMAIL_FROM;
const TEMPLATES = {
    'signup': {
        from: EMAIL_FROM,
        subject: 'Welcome to Talka!',
    },
    'delete': {
        from: EMAIL_FROM,
        subject: 'Bye from Talka!',
    }
}

module.exports = {
    TEMPLATES
}
