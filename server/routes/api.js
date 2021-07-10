'use strict';

const multer = require('multer');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

//sign up
//sign in
//crud reminders
modules.export = function(app) {
    const upload = multer();

    app.route('/signup')
        .post(upload.none(), (req, res) => {
            const email = req.body.email;
            const username = req.body.username;
            const password = req.body.password;
            //verify email is unique and username is unique
            
            //email or username is not unique            

            //generate verfication token and send verification email

        })
    
    app.route('/emailconfirmation/:email/:token')
        .get((req, res) => {
            //lookup token
            //ensure token is still valid then validate and create user
            //generate and send tokens and redirect
        });

    app.route('/resendemailconfirmation/:email')
        .get((req, res) => {
            //lookup email
            //the email is already validated
            //the email is not validated, send a verification email
        });

    app.route('/login')
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