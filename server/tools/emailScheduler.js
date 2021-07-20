'use strict';
const { Pool } = require('pg');
const reminderQuery = require('../db/reminder');
const nodemailer = require('nodemailer');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT,
});

exports.checkMissedReminders = async function() {
    //lookup db for any reminders whose time have passed and have not been sent due to server downtime
    let currentDate = new Date().getTime();
    let lookup = await reminderQuery.checkMissedReminders(currentDate);
    let count = lookup.rowCount;
    let email;
    let username;
    let reminderName;
    let reminderID;
    //for each reminder, send an email and update db
    for(let i = 0; i < count; i++) {
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ACCOUNT,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_ACCOUNT,
            to: email,
            subject: 'Account Verification Link',
            text: 'Hello ' + username + ',\n\nThis is a reminder for the following event: ' + reminder + '\nUnfortunately, the server was experiencing technical difficulties and missed the requested reminder time.  We apologize for the inconvenience.'
        }

        transporter.sendMail(mailOptions, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('Missed reminder emails have been sent.');
            }
        });
    }
    return;
}