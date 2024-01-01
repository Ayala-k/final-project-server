const cron = require('node-cron');
const { JobModel } = require('../models/Job');
const { sendEmail } = require('./sendEmail');

const findDay = (date) => {
    return date.toString().slice(0, 15);
}

const sendDailyEmails=async()=> {

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let jobs =await JobModel.find({
        is_canceled: false,
        contracted_professional: { $ne: null }
    }).populate('client_id')
    
    if (jobs) {
        jobs.forEach(j => {
            if (findDay(j.time) == findDay(yesterday)) {
                sendEmail(j.client_id.email, 'please commant ', 'לשלוח לינק');
            }
        });
    }
}

cron.schedule('00 12 * * *', () => {
    sendDailyEmails();
    console.log('This runs every day at midnight!');
});