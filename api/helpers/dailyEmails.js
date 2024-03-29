const cron = require('node-cron');
const { JobModel } = require('../models/Job');
const { sendEmail } = require('./sendEmail');

const findDay = (date) => {
    return date.toString().slice(0, 15);
}

const sendDailyEmails = async () => {

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let jobs = await JobModel.find({
        is_canceled: false,
        contracted_professional: { $ne: null }
    }).populate('client_id').populate('contracted_professional')

    if (jobs) {
        jobs.forEach(j => {
            if (findDay(j.time) == findDay(yesterday)) {
                let url = 'https://taupe-kleicha-da607e.netlify.app/write_comment/' + j.contracted_professional._id + '/' + j.specialization
                sendEmail(j.client_id.email, 'נשמח לקבל משוב אודות האימון שלך ', url,
                    `<div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h3 style="color: darkblue; font-size: 20px;">נשמח לקבל משוב אודות האימון שלך</h3>
                    <p style="color: #343a40; font-size: 16px; line-height: 1.6;">.האם נהנית מהאימון? מהמאמן? תרצה להמליץ עליו למשתמשים נוספים? נשמח לשמוע את חוות דעתך<br/></p>
                    <span style="color: black; font-size: 14px;"> לכתיבת תגובה ודרוג המאמן שלך <a href="${url}" style="color: darkblue; text-decoration: none;">לחץ כאן</a></span>
                    </div>`);

                //let reportProfessionalUrl = 'http://localhost:5173/report/' + j.contracted_professional.user_id
                //<span style="color: black; font-size: 14px;"> לדיווח על המאמן שלך<a href="${reportProfessionalUrl}" style="color: darkblue; text-decoration: none;">לחץ כאן</a></span>

                // let reportClientUrl = 'http://localhost:5173/report/' + j.client_id
                // sendEmail(j.contracted_professional.email, 'נשמח לקבל משוב אודות האימון שלך ', url,
                // `<div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                // <h3 style="color: darkblue; font-size: 20px;">נשמח לקבל משוב אודות האימון שלך</h3>
                // <p style="color: #343a40; font-size: 16px; line-height: 1.6;">עזור לנו לשמור על קהילת המשתמשים שלנו, במקרה של אי הגעה לאימון או תקלה בתשלום אנא דווח לנו.<br/></p>
                // <span style="color: black; font-size: 14px;"> לדיווח על הלקוח שלך<a href="${reportClientUrl}" style="color: darkblue; text-decoration: none;">לחץ כאן</a></span>
                // </div>`);
            }
        })
    }
}

cron.schedule('00 8 * * *', () => {
    sendDailyEmails();
    console.log('This runs every day at mid-day!');
});