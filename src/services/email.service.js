const sgMail = require('@sendgrid/mail')

class EmailService {
    async send(to, data) {
        data.to = to;
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        return sgMail.send(data);
    }
}

module.exports = EmailService;
