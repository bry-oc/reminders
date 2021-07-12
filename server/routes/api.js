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
                //verify email is unique and username is unique
                let lookup = userQuery.getUserByEmail(email);
                
                console.log(lookup);
                if(lookup.rowCount === 0) {
                    //email is unique
                    let lookup = userQuery.getUserByUsername(username);
                    if(lookup.rowCount === 0) {
                        //username is also unique                        
                        //hash password
                        const passwordHash = await argon2.hash(password);
                        //create user that is unverified; they must become verified to use the app
                        const userID = await userQuery.createUser(username, email, passwordHash);
                        if (!userID) {
                            res.status(500).end();
                        }
                        //create hash
                        const hexString = crypto.randomBytes(16).toString('hex');
                        //set two week expiration
                        const expirationDate = new Date(Date.now() + 14);
                        //generate verfication token and store it
                        const emailToken = await authQuery.createEmailToken(userID, hexString, expirationDate);
                        if(!emailToken) {
                            res.status(500).end();
                        }
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
                            text: 'Hello ' + username + ',\n\n Thank you for signing up with our app. Please verify your email address by clicking the link: \nhttp:\/\/' + req.host + '/api/emailconfirmation/' + userID + '/' + emailToken + ' \n  This link will expire in two weeks.  Please request another verification email if needed.'
                        }

                        transporter.sendMail(mailOptions, function (err) {
                            if (err) {
                                return res.status(500).end();
                            } else {
                                return res.status(200).send('A verification email has been sent to ' +email + '. ')
                            }
                        })
                    } else {
                        //username is being used
                        res.status(403).send('That username is already being used.').end();
                    }
                } else {
                    //email is being used
                    res.status(403).send('That email is already being used.').end();
                }                
            } catch (err) {
                console.log(err);
                res.status(500).end();
            }

        })

    app.route('/api/emailconfirmation/:userID/:token')
        .get((req, res) => {
            //lookup token
            //ensure token is still valid then validate and create user
            //generate and send tokens and redirect
        });

    app.route('/api/resendemailconfirmation/:email')
        .get((req, res) => {
            //lookup email
            //the email is already validated
            //the email is not validated, send a verification email
        });

    app.route('/api/login')
        .post(upload.none(), (req, res) => {
            //user provides username and password
            const username = req.body.username;
            const password = req.body.password;

            //verify the username and password in the database

            //user does not exist

            //user is verified, generate and send tokens and redirect

            //invalid password
        })
}