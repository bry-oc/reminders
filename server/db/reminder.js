'use strict';
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT,
});

exports.createReminder = async function(userid, name, description, repeat, date) {
    return await pool.query('INSERT INTO "reminder" ("userid", "name", "description", "repeat", "date") VALUES ($1, $2, $3, $4, $5) RETURNING "reminderid"', [userid, name, description, repeat, date]);
}

exports.getAllReminders = async function(userID) {
    return await pool.query('SELECT * FROM "reminder" WHERE "userid" = $1', [userID]);
}

exports.getReminder = async function(reminderID, userID) {
    return await pool.query('SELECT * FROM "reminder" WHERE "reminderid"=$1 AND "userid" = $2', [reminderID, userID]);
}

exports.updateReminder = async function(userID, reminderID, name, description, repeat, date) {
    return await pool.query('UPDATE "reminder" SET "name" = $1, "description" = $2, "repeat" = $3, "date" = $4, "sent" = $5 WHERE "userid" = $6 AND "reminderid" = $7', [name, description, repeat, date, false, userID, reminderID]);
}
exports.deleteReminder = async function(userID, reminderID) {
    return await pool.query('DELETE FROM "reminder" WHERE "userid" = $1 AND "reminderid" = $2', [userID, reminderID]);
}

exports.deleteAllReminders = async function(userID) {
    return await pool.query('DELETE FROM "reminder" WHERE "userid" = $1', [userID]);
}

exports.updateUserID = async function(newUserID, userID) {
    return await pool.query('UPDATE "reminder" SET userid = $1 WHERE userid = $2', [newUserID, userID]);
}

exports.checkMissedReminders = async function(currentDate) {
    return await pool.query('SELECT * FROM "reminder" WHERE ("date" - $1) < 0 AND "sent" = $2', [currentDate, false]);
}

exports.listCurrentReminders = async function(currentDate) {
    return await pool.query('SELECT * FROM "reminder" WHERE ("date" - $1) > 0 AND "sent" = $2',[currentDate, false]);
}

exports.setReminderSent = async function(reminderID) {
    return await pool.query('UPDATE "reminder" SET "sent" = $1 WHERE "reminderid" = $2',[true, reminderID]);
}