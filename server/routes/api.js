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
                        //userID and a 
                        //generate verfication token
                        const hexString = crypto.randomBytes(16).toString('hex');
                        const emailToken = await authQuery.createEmailToken(userID, hexString);
                        if(!emailToken) {
                            res.status(500).end();
                        }
                        //send verification email
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

    app.route('/api/emailconfirmation/:hash/:token')
        .get((req, res) => {
            //lookup token
            //ensure token is still valid then validate and create user
            //generate and send tokens and redirect
        });

    app.route('/api/resendemailconfirmation/:hash')
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