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

exports.getUserByEmailOrUsername = async function (email, username) {
    try {
        console.log(email);
        console.log(username);
        const result = await pool.query('SELECT * FROM reminder');
        console.log(result.rowCount);
        return result.rowCount;
    } catch (err) { 
        console.log(err);
    }
}