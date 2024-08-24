const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function sendSMS(to, message) {
    try {
        await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to
        });
    } catch (error) {
        throw new Error('Error al enviar el SMS'); // Solo lanza un error genérico
    }
}

module.exports = {
    sendSMS
};