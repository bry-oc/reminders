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

exports.updatePasswordAndID = async function(userID, newUserID, password) {
    return await pool.query('UPDATE "user" SET "password" = $1, "userid" = $2 WHERE "userid" = $3', [password, newUserID, userID]);
}

exports.updateUsername = async function(userID, username) {
    return await pool.query('UPDATE "user" SET "username" = $1 WHERE "userid" = $2', [username, userID]);
}

exports.updateEmail = async function (userID, email) {
    return await pool.query('UPDATE "user" SET "email" = $1 WHERE "userid" = $2', [username, email]);
}

exports.updatePassword = async function (userID, password) {
    return await pool.query('UPDATE "user" SET "password" = $1 WHERE "userid" = $2', [password, userID]);
}

exports.deleteUser = async function (userID) {
    return await pool.query('DELETE FROM "user" WHERE "userid" = $1', [userID]);
}

exports.deleteExpiredEmailTokens = async function(timestamp) {
    return await pool.query('DELETE FROM "email_verfication" WHERE ("expires" - $1 < 0)', [timestamp]);
}

exports.deleteExpiredPasswordResetTokens = async function(timestamp) {
    return await pool.query('DELETE FROM "password_reset" WHERE ("expires" - $1 < 0)', [timestamp]);
}

exports.deleteExpiredRefreshTokens = async function(timestamp) {
    return await pool.query('DELETE FROM "refresh_blacklist" WHERE ("expires" - $1 < 0)', [timestamp]);
}

exports.deleteUnverifiedAccounts = async function() {
    return await pool.query('DELETE FROM "user" WHERE "verified" = false AND "userid" NOT IN (SELECT email_verification.userid FROM "email_verification")');
}