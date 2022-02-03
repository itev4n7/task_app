const sgMail = require('@sendgrid/mail')

const sendGridAPIKey = process.env.SEND_API_KEY
const emailFrom = 'some.email@gmail.com'

sgMail.setApiKey(sendGridAPIKey)

const sendGreetingEmail = (email, name) => {
    return sgMail.send({
        to: email,
        from: emailFrom,
        subject: `Welcome ${name} in Task app`,
        text: 'Create your first task now!'
    }).catch(e => console.log('Error with sending email'))
}

const sendCancelEmail = (email, name) => {
    return sgMail.send({
        to: email,
        from: emailFrom,
        subject: `Hello ${name} you deleted your account from Task app`,
        text: 'With best wishes Task app'
    }).catch(e => console.log('Error with sending email'))
}

module.exports = {
    sendGreetingEmail,
    sendCancelEmail
}