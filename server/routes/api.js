'use strict';

const argon2 = require('argon2');
const crypto = require('crypto');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const userQuery = require('../db/user');
const authQuery = require('../db/auth');
require('dotenv').config();

//sign up
//sign in
//crud reminders
module.exports = function (app) {
    const upload = multer();

    app.route('/api/signup')
        .post(upload.none(), async (req, res) => {
            try {
                const email = req.body.email;
                const username = req.body.username;
                const password = req.body.password;
                if (!email || !username || !password) {
                    return res.status(500).send('Missing required field(s)!').end();
                }
                //verify email is unique and username is unique
                let lookup = await userQuery.getUserByEmail(email);
                if (lookup.rowCount === 0) {
                    //email is unique
                    let lookup = await userQuery.getUserByUsername(username);
                    if (lookup.rowCount === 0) {
                        //username is also unique                        
                        //hash password
                        const passwordHash = await argon2.hash(password);
                        //create user that is unverified; they must become verified to use the app
                        lookup = await userQuery.createUser(username, email, passwordHash);
                        if (!lookup.rows[0].userid) {
                            return res.status(500).send('User creation failed.').end();
                        }
                        const userID = lookup.rows[0].userid;
                        //create hash
                        const hexString = crypto.randomBytes(16).toString('hex');
                        //set two week expiration
                        const expirationDate = new Date().getTime() + 1000 * 60 * 60 * 24 * 14;
                        //generate verfication token and store it
                        lookup = await authQuery.createEmailToken(userID, hexString, expirationDate);
                        if (!lookup.rows[0].token) {
                            return res.status(500).send('Email token failed to generate.').end();
                        }
                        const emailToken = lookup.rows[0].token;
                        //send verification email
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.EMAIL_ACCOUNT,
                                pass: process.env.EMAIL_PASSWORD
                            }
                        });

                        const mailOptions = {
                            from: process.env.EMAIL_ACCOUNT,
                            to: email,
                            subject: 'Account Verification Link',
                            text: 'Hello ' + username + ',\n\nThank you for signing up with our app. Please verify your email address by clicking the link: \nhttp://localhost:3001/api/emailconfirmation/' + userID + '/' + emailToken + '\nThis link will expire in two weeks.  Please request another verification email if needed.'
                        }

                        transporter.sendMail(mailOptions, function (err) {
                            if (err) {
                                return res.status(500).send('Email failed to send.').end();
                            } else {
                                return res.status(200).send('A verification email has been sent to ' + email + '.')
                            }
                        });
                    } else {
                        //username is being used
                        return res.status(403).send('That username is already being used.').end();
                    }
                } else {
                    //email is being used
                    return res.status(403).send('That email is already being used.').end();
                }
            } catch (err) {
                return res.status(500).send('Interal Server Error').end();
            }

        })

    app.route('/api/emailconfirmation/:userid/:token')
        .get(async (req, res) => {
            try {
                const userID = req.params.userid;
                const token = req.params.token;
                const timestamp = new Date().getTime();
                //lookup token
                //ensure token is still valid then validate user
                let lookup = await authQuery.getEmailToken(userID, token, timestamp);
                if (lookup.rowCount <= 0) {
                    //userid and token failed to validate
                    return res.status(404).send('Your verification link is invalid. Please request another link.').end();
                } else {
                    //the token is valid
                    //check if the user is already verified
                    lookup = await userQuery.getUserByUserID(userID);
                    if (lookup.rowCount <= 0) {
                        //the user was not found
                        return res.status(404).send('That user does not exist.').end();
                    } else if (lookup.rows[0].verified === true) {
                        //the user is already verified
                        return res.status(200).send('Your account is already verified.').end();
                    } else {
                        //update the user to verified
                        await authQuery.updateVerifiedUser(userID);
                        return res.status(200).send('Your account is now verified.').end();
                    }
                }
            } catch (err) {
                return res.status(500).send('Internal Server Error').end();
            }
        });

    app.route('/api/resendemailconfirmation/:email')
        .get( async (req, res) => {
            try {
                //lookup email
                const email = req.params.email;
                let lookup = await userQuery.getUserByEmail(email);
                if(lookup.rowCount <= 0) {
                    return res.status(400).send('That email was not found.')
                } else if (lookup.rows[0].verified === true){
                    //the email is already validated
                    return res.status(200).send('Your account is already verified.')
                } else {
                    //the email is not validated, send a verification email
                    //create email token
                    const userID = lookup.rows[0].userid;
                    const username = lookup.rows[0].username;
                    //create hash
                    const hexString = crypto.randomBytes(16).toString('hex');
                    //set two week expiration
                    const expirationDate = new Date().getTime() + 1000 * 60 * 60 * 24 * 14;
                    //generate verfication token and store it
                    lookup = await authQuery.createEmailToken(userID, hexString, expirationDate);
                    if (!lookup.rows[0].token) {
                        return res.status(500).send('Email token failed to generate.').end();
                    }
                    const emailToken = lookup.rows[0].token;
                    //send verification email
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.EMAIL_ACCOUNT,
                            pass: process.env.EMAIL_PASSWORD
                        }
                    });

                    const mailOptions = {
                        from: process.env.EMAIL_ACCOUNT,
                        to: email,
                        subject: 'Account Verification Link',
                        text: 'Hello ' + username + ',\n\nThank you for signing up with our app. Please verify your email address by clicking the link: \nhttp://localhost:3001/api/emailconfirmation/' + userID + '/' + emailToken + '\nThis link will expire in two weeks.  Please request another verification email if needed.'
                    }

                    transporter.sendMail(mailOptions, function (err) {
                        if (err) {
                            return res.status(500).send('Email failed to send.').end();
                        } else {
                            return res.status(200).send('A verification email has been sent to ' + email + '.')
                        }
                    });
                }
                
                
            } catch (err) {
                console.log(err);
                return res.status(500).send('Internal Server Error').end();
            }
        });

    app.route('/api/login')
        .post(upload.none(), (req, res) => {
            try {
                //user provides username and password
                const username = req.body.username;
                const password = req.body.password;

                //verify the username and password in the database

                //user does not exist

                //user is verified, generate and send tokens and redirect

                //invalid password
            } catch (err) {

            }
        })
}