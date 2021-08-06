'use strict';

const { Pool } = require('pg');
const schedule = require('node-schedule');
const scheduleQuery = require('./auth')
require('dotenv').config();

const pool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT,
});

exports.deleteExpiredRows = async function() {
    //delete expired verfication email tokens, expired password reset email tokens, and expired refresh tokens from the database
    //everyday at 4am, the expired column will be compared to current time and delete any rows that have already expired
    const timestamp = new Date().getTime();
    const job = schedule.scheduleJob('expired_cleanup', '0 0 4 * * *', function () {
        await scheduleQuery.deleteExpiredEmailTokens(timestamp);
        await scheduleQuery.deleteExpiredPasswordResetTokens(timestamp);
        await scheduleQuery.deleteExpiredRefreshTokens(timestamp);
        console.log('Daily deletion of expired rows from database.');
        return;
    });
}
