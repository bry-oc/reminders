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

exports.createEmailToken = async function(userID, token, expirationDate) {
    return await pool.query('INSERT INTO "email_token" ("userid", "token", "expires") VALUES ($1, $2, $3) RETURNING "token"', [userID, token, expirationDate]);
}