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
    let reminderDescription;
    let reminderID;
    let userID;
    let date;
    let minutes;
    let hours;
    let day;
    let month;
    let year;
    let scheduled;

    //for each reminder, send an email and update db
    for(let i = 0; i < count; i++) {
        userID = reminders[i].userid;
        lookup = await userQuery.getUserByUserID(userID);
        email = lookup.rows[0].email;
        username = lookup.rows[0].username;
        reminderName = reminders[i].name;
        reminderDescription = reminders[i].description;
        reminderID = reminders[i].reminderid;
        date = new Date(reminders[i].date);
        day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        year = date.getFullYear();
        hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

        if (reminders[i].repeat === "daily") {
            day = "*";
            scheduled = minutes + " " + hours + " " + day + " " + month + " *";
        } else if (reminders[i].repeat === "weekly") {
            day = day + "/7"
            scheduled = minutes + " " + hours + " " + day + " " + month + " *";
        } else if (reminders[i].repeat === "biweekly") {
            day = day + "/14"
            scheduled = minutes + " " + hours + " " + day + " " + month + " *";
        } else if (reminders[i].repeat === "monthly") {
            month = "*";
            scheduled = minutes + " " + hours + " " + day + " " + month + " *";
        } else {
            scheduled = minutes + " " + hours + " " + day + " " + month + " *";
        }

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
            html: 'Hello ' + username + ',<br/><br>This is a reminder for the following event: ' + reminderName + "<br/><br>Date: " + month + "/" + day + "/" + year + "<br/><br>Time: " + hours + ":" + minutes + "<br/><br>Description: " + reminderDescription + "<br/><br>Unfortunately, the server was experiencing technical difficulties and missed the requested reminder time.<br/><br>We apologize for the inconvenience."
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
    const currentDate = new Date().getTime();
    let lookup = await reminderQuery.listCurrentReminders(currentDate);
    let count = lookup.rowCount;
    const reminders = lookup.rows;
    let email;
    let username;
    let reminderName;
    let reminderDescription;
    let reminderID;
    let userID;
    let jobs = {};
    let date;
    let minutes;
    let hours;
    let day;
    let month;
    let year;
    let scheduled;

    //for each reminder, create a job
    for (let i = 0; i < count; i++) {
        userID = reminders[i].userid;
        lookup = await userQuery.getUserByUserID(userID);
        email = lookup.rows[0].email;
        username = lookup.rows[0].username;
        reminderName = reminders[i].name;
        reminderDescription = reminders[i].description;
        reminderID = reminders[i].reminderid;
        date = new Date(reminders[i].date);
        day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        year = date.getFullYear();
        hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

        if (reminders[i].repeat === "daily") {
            day = "*";
            scheduled = minutes + " " + hours + " " + day + " " + month + " *";
        } else if (reminders[i].repeat === "weekly") {
            day = day + "/7"
            scheduled = minutes + " " + hours + " " + day + " " + month + " *";
        } else if (reminders[i].repeat === "biweekly") {
            day = day + "/14"
            scheduled = minutes + " " + hours + " " + day + " " + month + " *";
        } else if (reminders[i].repeat === "monthly") {
            month = "*";
            scheduled = minutes + " " + hours + " " + day + " " + month + " *";
        } else {
            scheduled = minutes + " " + hours + " " + day + " " + month + " *";
        }
        
        jobs[reminderID] = schedule.scheduleJob(reminderID.toString(), scheduled, function () {
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
                html: 'Hello ' + user.username + ',<br/><br>This is a reminder for the following event: ' + reminderName + "<br/><br>Date: " + month + "/" + day + "/" + year + "<br/><br>Time: " + hours + ":" + minutes + "<br/><br>Description: " + reminderDescription + "<br/><br>Thank you for using our friendly reminders. :)"
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
    return jobs;
}

exports.createReminder = async function(user, reminder) {
    //create cron job when reminder is created
    console.log(reminder.date);
    const date = new Date(reminder.date);
    console.log(date);
    let job = {};
    const reminderID = reminder.reminderid;
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    let year = date.getFullYear();
    let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

    let scheduled;
    if (reminder.repeat === "daily") {
        day = "*";
        scheduled = minutes + " " + hours + " " + day + " " + month + " *";
    } else if (reminder.repeat === "weekly") {
        day = day + "/7"
        scheduled = minutes + " " + hours + " " + day + " " + month + " *";
    } else if (reminder.repeat === "biweekly") {
        day = day + "/14"
        scheduled = minutes + " " + hours + " " + day + " " + month + " *";
    } else if (reminder.repeat === "monthly") {
        month = "*";
        scheduled = minutes + " " + hours + " " + day + " " + month + " *";
    } else {
        scheduled = minutes + " " + hours + " " + day + " " + month + " *";
    }
    console.log(scheduled);

    job[reminderID] = schedule.scheduleJob(reminderID.toString(), scheduled, function(){
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
            html: 'Hello ' + user.username + ',<br/><br>This is a reminder for the following event: ' + reminder.name + "<br/>Date: " + month + "/" + day + "/" + year + "<br/>Time: " + hours + ":" + minutes + "<br/>Description: " + reminder.description + "<br/><br>Thank you for using our friendly reminders. :)"
        }


        transporter.sendMail(mailOptions, async function (err) {
            if (err) {
                console.log(err);
            } else {
                await reminderQuery.setReminderSent(reminder.reminderid);
            }
        });
    });
    return;
}

exports.updateReminder = async function(reminder, user) {
    //delete ongoing cron job and create new job with updated information
    const currentJob = schedule.scheduledJobs[(reminder.reminderid).toString()];
    
    if(currentJob) {
        currentJob.cancel();
    }
    
    let newJob = {};
    const date = new Date(reminder.date);
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    let year = date.getFullYear();
    let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let scheduled;

    if (reminder.repeat === "daily") {
        day = "*";
        scheduled = minutes + " " + hours + " " + day + " " + month + " *";
    } else if (reminder.repeat === "weekly") {
        day = day + "/7"
        scheduled = minutes + " " + hours + " " + day + " " + month + " *";
    } else if (reminder.repeat === "biweekly") {
        day = day + "/14"
        scheduled = minutes + " " + hours + " " + day + " " + month + " *";
    } else if (reminder.repeat === "monthly") {
        month = "*";
        scheduled = minutes + " " + hours + " " + day + " " + month + " *";
    } else {
        scheduled = minutes + " " + hours + " " + day + " " + month + " *";
    }

    newJob[reminder.reminderid] = schedule.scheduleJob((reminder.reminderid).toString(), scheduled, function () {
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
            html: 'Hello ' + user.username + ',<br/><br>This is a reminder for the following event: ' + reminder.name + "<br/><br>Date: " + month + "/" + day + "/" + year + "<br/><br>Time: " + hours + ":" + minutes + "<br/><br>Description: " + reminder.description + "<br/><br>Thank you for using our friendly reminders. :)"
        }


        transporter.sendMail(mailOptions, async function (err) {
            if (err) {
                console.log(err);
            } else {
                await reminderQuery.setReminderSent(reminder.reminderid);
            }
        });
    });
    return newJob;
}

exports.deleteReminder = async function(reminderid) {
    const currentJob = schedule.scheduledJobs[reminderid.toString()];

    if (currentJob) {
        currentJob.cancel();
    }
    
    return;
}