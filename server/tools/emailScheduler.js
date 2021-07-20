'use strict';
const { Pool } = require('pg');
const reminderQuery = require('../db/reminder');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT,
});

exports.checkMissedReminders = async function() {
    //lookup db for any reminders whose time have passed and have not been sent
    let currentDate = new Date().getTime();
    let lookup = await reminderQuery.checkMissedReminders(currentDate);
    let count = lookup.rowCount;
    //for each reminder, send an email and update db
    return;
}