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

exports.getUserByUsername = async function (username) {
    return await pool.query('SELECT * FROM "user" WHERE "username" = $1', [username]);
}

exports.getUserByEmail = async function (email) {
    return await pool.query('SELECT * FROM "user" WHERE "email" = $1', [email]);
}

exports.getUserByUserID = async function (userID) {
    return await pool.query('SELECT * from "user" WHERE "userid" = $1', [userID]);
}

exports.createUser = async function(userID, username, email, password) {
    return await pool.query('INSERT INTO "user"(userid, username, email, password) VALUES($1,$2,$3,$4) RETURNING userid', [userID, username, email, password]);
}
