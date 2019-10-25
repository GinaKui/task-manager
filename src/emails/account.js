const sgMail = require('@sendgrid/mail');
const sendgridAPIKey = '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';

sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'developerkui@devk.io',
    subject: `Thanks for joining in, ${name}`,
    text: `Welcome to task manager app, ${name}. Let me know how you feel about this app.`
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'developerkui@devk.io',
    subject: `Sorry to see you leave`,
    text: `Goodbye, ${name}. I hope to see you back sometime soon.`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}