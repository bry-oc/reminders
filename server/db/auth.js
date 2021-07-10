'use strict';
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,    
    port: process.env.PG_PORT,
});

exports.createEmailToken = async function(userID, token) {
    return await pool.query('INSERT INTO email_token (userID, emailToken) VALUES ($1, $2) RETURNING token', [userID, token]);
}