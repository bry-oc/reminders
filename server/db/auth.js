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

exports.createEmailVerificationToken = async function(userID, token, expirationDate) {
    return await pool.query('INSERT INTO "email_verification" ("userid", "token", "expires") VALUES ($1, $2, $3) RETURNING "token"', [userID, token, expirationDate]);
}

exports.getEmailVerificationToken = async function(userID, token, currentDate) {
    return await pool.query('SELECT * FROM "email_verification" WHERE userid = $1 AND "token" = $2 AND ("expires" - $3 > 0)', [userID, token, currentDate]);
}

exports.updateVerifiedUser = async function(userid) {
    return await pool.query('UPDATE "user" SET "verified" = true WHERE "userid" = $1', [userid]);
}

exports.checkRefreshBlacklist = async function(tokenid) {
    return await pool.query('SELECT EXISTS (SELECT 1 FROM "refresh_blacklist" WHERE "jti" = $1)', [tokenid]);
}

exports.blacklistRefreshToken = async function(tokenid, expirationDate) {
    return await pool.query('INSERT INTO "refresh_blacklist" ("jti", "expires") VALUES ($1, $2)', [tokenid, expirationDate]);
}

exports.isAdmin = async function(userID) {
    return await pool.query('SELECT "admin" FROM "user" WHERE "userid" = $1', [userID]);
}

exports.createResetEmailToken = async function(userID, token, expirationDate) {
    return await pool.query('INSERT INTO "password_reset" ("userid", "token", "expires") VALUES ($1, $2, $3)', [userID, token, expirationDate]);
}

exports.getResetEmailToken = async function(userID, token, currentDate) {
    return await pool.query('SELECT * FROM "password_reset" WHERE userid = $1 AND token = $2 AND ("expires" - $3 > 0)', [userID, token, currentDate]);
}
