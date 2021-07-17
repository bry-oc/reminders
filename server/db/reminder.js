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
    return await pool.query('INSERT INTO "reminder" ("userid", "name", "description", "repeat", "date") VALUES ($1, $2, $3, $4, $5)', [userid, name, description, repeat, date]);
}