'use strict';

const nodemailer = require('nodemailer');
const { Pool } = require('pg');
const schedule = require('node-schedule');
const reminderQuery = require('../db/reminder');
const userQuery = require('../db/user');
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
    const reminders = lookup.rows;
    let email;
    let username;
    let reminderName;
    let reminderID;
    let userID;

    //for each reminder, send an email and update db
    for(let i = 0; i < count; i++) {
        userID = reminders[i].userid;
        lookup = await userQuery.getUserByUserID(userID);
        email = lookup.rows[0].email;
        username = lookup.rows[0].username;
        reminderName = reminders[i].name;
        reminderID = reminders[i].reminderid;

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
            subject: 'Reminder Notification: ' + reminderName,
            html: 'Hello ' + username + ',<br/><br><br/><br>This is a reminder for the following event: ' + reminderName + "<br/><br>More information about this event can be found <a href='https://localhost:3000/user/" + userID + "/reminder/" + reminderID + "'>here</a>.<br/><br>Unfortunately, the server was experiencing technical difficulties and missed the requested reminder time.<br/><br>We apologize for the inconvenience."
        }

        
        transporter.sendMail(mailOptions, async function (err) {
            if (err) {
                console.log(err);
            } else {
                await reminderQuery.setReminderSent(reminderID);
            }
        });
    }

    if(count <= 0) {
        console.log('No reminder emails were missed.')
    } else {
        console.log('Missed reminder emails have been sent.');
    }
    
    return;
}

exports.initializeAllReminders = async function() {
    //set cron jobs for all active reminders after server restart
}

exports.createReminder = async function(user, reminder) {
    //create cron job when reminder is created
    const date = new Date(reminder.timestamp);

    const job = schedule.scheduleJob(date, function(){
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ACCOUNT,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_ACCOUNT,
            to: user.email,
            subject: 'Reminder Notification: ' + reminder.name,
            html: 'Hello ' + user.username + ',<br/><br><br/><br>This is a reminder for the following event: ' + reminder.name + "<br/><br>More information about this event can be found <a href='https://localhost:3000/user/" + reminder.userid + "/reminder/" + reminder.reminderid + "'>here</a>."
        }


        transporter.sendMail(mailOptions, async function (err) {
            if (err) {
                console.log(err);
            } else {
                await reminderQuery.setReminderSent(reminder.reminderid);
            }
        });
    });
}

exports.updateReminder = async function() {
    //delete ongoing cron job and create new job with updated information
}