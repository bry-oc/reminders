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

exports.updateReminder = async function(userID, reminderID, name, description, repeat, date) {
    return await pool.query('UPDATE "reminder" SET "name" = $1, "description" = $2, "repeat" = $3, "date" = $4 WHERE "userid" = $5 AND "reminderid" = $6', [name, description, repeat, date, userID, reminderID]);
}
exports.deleteReminder = async function(userID, reminderID) {
    return await pool.query('DELETE FROM "reminder" WHERE "userid" = $1 AND "reminderid" = $2', [userID, reminderID]);
}

exports.updateUserID = async function(newUserID, userID) {
    return await pool.query('UPDATE "reminder" SET userid = $1 WHERE userid = $2', [newUserID, userID]);
}