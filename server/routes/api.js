'use strict';

const argon2 = require('argon2');
const crypto = require('crypto');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const userQuery = require('../db/user');
const authQuery = require('../db/auth');
const reminderQuery = require('../db/reminder');
const cookieHandler = require('../tools/cookieExtractor');
const emailScheduler = require('../tools/emailScheduler');
const serverValidation = require('../tools/serverValidation');
require('dotenv').config();

//sign up
//sign in
//crud reminders
module.exports = function (app) {
    const upload = multer();
    let ExtractJWT = passportJWT.ExtractJwt;
    let JwtStrategy = passportJWT.Strategy;
    let jwtOptions = {};

    jwtOptions.jwtFromRequest = cookieHandler.cookieExtractor;
    jwtOptions.secretOrKey = process.env.JWT_SECRET;
    jwtOptions.refreshSecretOrKey = process.env.JWT_REFRESH_SECRET;
    

    let strategy = new JwtStrategy(jwtOptions, async function(jwt_payload, next) {        
        let lookup = await userQuery.getUserByUserID(jwt_payload.userid);
        let user;
        if(lookup.rowCount <= 0 ) {
            next(null, false);
        } else {
            user = lookup.rows[0];
            next(null, user);
        }
    });

    passport.use(strategy);
    

    app.route('/api/signup')
        .post(upload.none(), async (req, res) => {
            try {
                const email = req.body.email;
                const username = req.body.username;
                const password = req.body.password;
                if (!email || !username || !password) {
                    return res.status(400).json({error: 'Missing required field(s)!'}).end();
                }
                //validate user inputs
                if(!serverValidation.isValidEmail(email)) {
                    return res.status(400).json({error: 'Invalid email.'}).end();
                }
                if(!serverValidation.isValidUsername(username)) {
                    return res.status(400).json({error: 'Invalid username.'}).end();
                }
                if (!serverValidation.isValidPassword(password)) {
                    return res.status(400).json({error: 'Invalid password.'}).end();
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
                        const userID = crypto.randomBytes(16).toString('hex');
                        //create user that is unverified; they must become verified to use the app
                        lookup = await userQuery.createUser(userID, username, email, passwordHash);
                        if (!lookup.rows[0].userid) {
                            return res.status(500).json({error: 'User creation failed.'}).end();
                        }
                        //create hash
                        const hexString = crypto.randomBytes(16).toString('hex');
                        //set two week expiration
                        const expirationDate = new Date().getTime() + 1000 * 60 * 60 * 24 * 14;
                        //generate verfication token and store it
                        lookup = await authQuery.createEmailVerificationToken(userID, hexString, expirationDate);
                        if (!lookup.rows[0].token) {
                            return res.status(500).json({error: 'Email token failed to generate.'}).end();
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
                                return res.status(500).json({error: 'Email failed to send.'}).end();
                            } else {
                                return res.status(200).json({message: 'A verification email has been sent to ' + email + '.'}).end();
                            }
                        });
                    } else {
                        //username is being used
                        return res.status(403).json({error: 'That username is already being used.'}).end();
                    }
                } else {
                    //email is being used
                    return res.status(403).json({error: 'That email is already being used.'}).end();
                }
            } catch (err) {
                console.log(err);
                return res.status(500).json({error: 'Interal Server Error'}).end();
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
                let lookup = await authQuery.getEmailVerificationToken(userID, token, timestamp);
                if (lookup.rowCount <= 0) {
                    //userid and token failed to validate
                    return res.status(404).json({error: 'Your verification link is invalid. Please request another link.'}).end();
                } else {
                    //the token is valid
                    //check if the user is already verified
                    lookup = await userQuery.getUserByUserID(userID);
                    if (lookup.rowCount <= 0) {
                        //the user was not found
                        return res.status(404).json({error: 'That user does not exist.'}).end();
                    } else if (lookup.rows[0].verified === true) {
                        //the user is already verified
                        return res.status(200).json({message: 'Your account is already verified.'}).end();
                    } else {
                        //update the user to verified
                        await authQuery.updateVerifiedUser(userID);
                        return res.status(200).json({message: 'Your account is now verified.'}).end();
                    }
                }
            } catch (err) {
                return res.status(500).json({error: 'Internal Server Error'}).end();
            }
        });

    app.route('/api/resendemailconfirmation')
        .post(upload.none(), async (req, res) => {
            try {
                //lookup email
                const email = req.body.email;
                if(!email){
                    return res.status(400).json({error: 'Missing required field!'}).end();
                }
                let lookup = await userQuery.getUserByEmail(email);
                if(lookup.rowCount <= 0) {
                    return res.status(400).json({error: 'That email was not found.'}).end();
                } else if (lookup.rows[0].verified === true){
                    //the email is already validated
                    return res.status(200).json({message: 'Your account is already verified.'}).end();
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
                    lookup = await authQuery.createEmailVerificationToken(userID, hexString, expirationDate);
                    if (!lookup.rows[0].token) {
                        return res.status(500).json({error: 'Email token failed to generate.'}).end();
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
                            return res.status(500).json({error: 'Email failed to send.'}).end();
                        } else {
                            return res.status(200).json({message: 'A verification email has been sent to ' + email + '.'}).end();
                        }
                    });
                }               
            } catch (err) {
                return res.status(500).json({error: 'Internal Server Error'}).end();
            }
        });

    app.route('/api/login')
        .post(upload.none(), async (req, res) => {
            try {
                //user provides username and password
                const username = req.body.username;
                const password = req.body.password;
                if(!username || !password){
                    return res.status(400).json({error: 'Missing required field(s)!'}).end();
                }
                //verify the username and password in the database
                let lookup = await userQuery.getUserByUsername(username);
                if(lookup.rowCount <= 0) {
                    //user does not exist
                    return res.status(404).json({error: 'Login failed. Username or password did not match.'}).end();
                } else {
                    const passwordHash = lookup.rows[0].password;
                    if(await argon2.verify(passwordHash, password)) {                        
                        //password match
                        //user is verified, generate and send tokens
                        const user = lookup.rows[0];
                        let jti = crypto.randomBytes(16).toString('hex');
                        const payload = { jti: jti, userid: user.userid, username: user.username, email: user.email }
                        const token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: 60 * 5 });
                        jti = crypto.randomBytes(16).toString('hex');
                        const refreshPayload = { jti: jti, userid: user.userid, username: user.username, email: user.email }
                        const refreshToken = jwt.sign(refreshPayload, jwtOptions.refreshSecretOrKey, { expiresIn: "14d"} );
                        res.cookie('jwt', token, { httpOnly: true, sameSite: true});
                        res.cookie('refresh', refreshToken, { httpOnly: true, sameSite: true });
                        res.json({ success: true, message: 'Login was successful.'}).end();
                    } else {
                        //password failed
                        //invalid password
                        return res.status(404).json({error: 'Login failed. Username or password did not match.'}).end();
                    }
                }
            } catch (err) {
                return res.status(500).json({error: 'Internal Server Error'}).end();
            }
        });
    
    app.route('/api/profile')
        .get(passport.authenticate('jwt', {session: false}), (req, res) => {
            res.json({message: 'Access granted.'});
        });
    
    //renew access token by verifying refresh token
    //check the refresh token blacklist to ensure refresh token is still valid
    //issue a renewed access token
    app.route('/api/token/refresh')
        .post(async (req, res) => {
            try {
                const token = req.cookies['refresh'];
                if(!token) {
                    return res.status(401).json({error: 'Unauthorized'}).end();
                }
                const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
                let lookup = await userQuery.getUserByUserID(decoded.userid);
                if(lookup.rowCount <= 0) {
                    res.clearCookie('refresh');
                    return res.status(401).json({error: 'Unauthorized'}).end();
                }
                lookup = await authQuery.checkRefreshBlacklist(decoded.jti);
                const isBlacklisted = lookup.rows[0].exists;               
                if(isBlacklisted) {
                    res.clearCookie('refresh');
                    return res.status(401).json({error: 'Unauthorized'}).end();
                } else {
                    const jti = crypto.randomBytes(16).toString('hex');
                    const payload = { jti: jti, userid: decoded.userid, username: decoded.username, email: decoded.email }
                    const token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: 60 * 5 });
                    res.cookie('jwt', token, { httpOnly: true, sameSite: true }).json({ success: true, token: token }).end();;
                }
            } catch (err) {
                if (err.name === "JsonWebTokenError") {
                    res.clearCookie('refresh');
                    return res.status(401).json({error: 'Invalid Refresh Token'}).end();
                }
                return res.status(500).json({error: 'Internal Server Error'}).end();
            }
        });
    
    //admins can revoke refresh tokens by blacklisting them
    //the user will need to login again to generate a new refresh token
    app.route('/api/token/revoke')
        .post(passport.authenticate('jwt', { session: false }), async (req, res) => {
            try {
                //receive admin cookies and given refresh token                
                //decode access token jwt from cookie
                const token = req.cookies['jwt'];
                const blacklistToken = req.body.blacklistToken;
                if(!token || !blacklistToken) {
                    return res.status(400).json({error: 'Missing required field(s)!'}).end();
                }
                let decoded = jwt.verify(token, process.env.JWT_SECRET);
                //verify user is an admin

                let lookup = await authQuery.isAdmin(decoded.userid);
                const isAdmin = lookup.rows[0].admin;
                if(isAdmin) {
                    decoded = jwt.verify(blacklistToken, process.env.JWT_REFRESH_SECRET)
                    //blacklist requested refresh token
                    //store jti and expiration timestamp of the token
                    const decodedBlacklistToken = jwt.verify(blacklistToken, process.env.JWT_REFRESH_SECRET);
                    const blacklistJTI = decodedBlacklistToken.jti;
                    const blacklistExpirationDate = decodedBlacklistToken.exp;
                    await authQuery.blacklistRefreshToken(blacklistJTI, blacklistExpirationDate);
                    return res.status(200).json({message: 'Refresh token was successfully blacklisted.'}).end();
                } else {
                    //user is not an admin
                    return res.status(401).json({error: 'User is unauthorized'}).end();
                }
            } catch (err) {
                if(err.name === "JsonWebTokenError") {
                    return res.status(400).json({error: 'Invalid Refresh Token'}).end();
                }
                return res.status(500).json({error: 'Internal Server Error'}).end();
            }    
        });

    app.route('/api/password/reset')
        .post(upload.none(), async (req, res) => {
            try {
                //receive user email
                const email = req.body.email
                if(!email) {
                    return res.status(400).json({error: 'Missing Required field!'}).end();
                }
                //lookup email in database
                let lookup = await userQuery.getUserByEmail(email);
                if(lookup.rowCount <= 0) {
                    //email did not return a match
                    return res.status(400).json({error: 'User does not exist'});
                } else {
                    //create & store id and reset token in password_reset table
                    const username = lookup.rows[0].username;
                    const userID = lookup.rows[0].userid;
                    const resetToken = crypto.randomBytes(16).toString('hex');
                    //users have two days to use the reset token
                    const expirationDate = new Date().getTime() + 1000 * 60 * 60 * 24 * 2;
                    lookup = await authQuery.createResetEmailToken(userID, resetToken, expirationDate);
                    //send email with id and reset token as parameters
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
                        subject: 'Password Reset Request',
                        text: 'Hello ' + username + ',\n\nA password reset was requested. Please reset your password by clicking the link: \nhttp://localhost:3001/api/password/reset/' + userID + '/' + resetToken + '\nThis link will expire in two days.  If this password reset was not requested by you, please ignore this email.'
                    }

                    transporter.sendMail(mailOptions, function (err) {
                        if (err) {
                            return res.status(500).json({error: 'Email failed to send.'}).end();
                        } else {
                            return res.status(200).json({message: 'A reset password email has been sent to ' + email + '.'}).end();
                        }
                    });
                }                
            } catch (err) {
                console.log(err);
                return res.status(500).json({error: 'Internal Server Error'}).end();
            }
        });
    
    app.route('/api/password/reset/:userid/:token')
        .post(upload.none(), async (req, res) => {
            try {
                //receive new password
                const password = req.body.password;
                const userID = req.params.userid;
                const token = req.params.token;
                const timestamp = new Date().getTime();
                if(!password) {
                    return res.status(400).json({error: 'Missing required field!'}).end();
                }
                //lookup id and token in password_reset table
                let lookup = await authQuery.getResetEmailToken(userID, token, timestamp);
                if(lookup.rowCount <= 0) {
                    return res.status(404).json({error: 'Your reset password link is invalid. Please request another link.'}).end();
                } else {
                    //id and token are valid
                    //update password and user id to prevent previous tokens having access
                    //update associated reminders
                    const passwordHash = await argon2.hash(password);
                    const newUserID = crypto.randomBytes(16).toString('hex');
                    await authQuery.updatePasswordAndID(userID, newUserID, passwordHash);
                    await reminderQuery.updateUserID(newUserID, userID);
                    return res.status(200).json({message: 'Password has been reset successfully.'}).end();
                }
            } catch (err) {
                return res.status(500).json({error: 'Internal Server Error'}).end();
            }
        });
    
    app.route('/api/reminder/create')
        .post(upload.none(), passport.authenticate('jwt', { session: false }), async (req, res) => {
            try {
                //receieve user info and reminder data
                const token = req.cookies['jwt'];
                const user = jwt.verify(token, process.env.JWT_SECRET);
                const userID = user.userid;
                const reminderName = req.body.reminderName;
                const timezone = req.body.timezone;
                let reminderDescription = req.body.reminderDescription;
                let reminderRepeat = req.body.reminderRepeat;
                let reminderDate = req.body.reminderDate;
                let reminderTime = req.body.reminderTime;  

                //return error if required fields are missing
                if(!userID || !reminderName || !reminderDate || !reminderTime || !timezone) {
                    return res.status(400).json({error: 'Missing required field(s)!'}).end();
                }

                //validate date and time
                if(!serverValidation.isValidDate(reminderDate)) {
                    return res.status(400).json({error: 'Invalid date.'}).end();
                }
                if(!serverValidation.isValidTime(reminderTime)) {
                    return res.status(400).json({error: 'Invalid time.'}).end();
                }

                //set default values for optional parameters if not provided
                if(!reminderRepeat) {
                    reminderRepeat = 'never';
                }
                if(!reminderDescription) {
                    reminderDescription = '';
                }

                //get timestamp from the given date and time
                const reminderHours = reminderTime.split(':')[0];
                const reminderMinutes = reminderTime.split(':')[1];
                reminderDate = new Date(reminderDate);
                reminderDate.setUTCHours(reminderHours + timezone);
                reminderDate.setUTCMinutes(reminderMinutes);
                reminderDate = reminderDate.getTime();
                
                const reminder = {
                    reminderid: reminderID,
                    name: reminderName,
                    date: reminderDate,
                    userid: userID
                }
                
                //create the reminder and return its id
                let lookup = await reminderQuery.createReminder(userID, reminderName, reminderDescription, reminderRepeat, reminderDate);
                const reminderid = lookup.rows[0].reminderid;
                //create job for the reminder email
                await emailScheduler.createReminder(user, reminder);

                return res.status(200).json({ reminderid: reminderid }).end();
            } catch(err) {
                console.log(err);
                return res.status(500).json({error: 'Internal Server Error'}).end();
            }
        });
    
    app.route('/api/reminder/update')
        .post(upload.none(), passport.authenticate('jwt', { session: false }), async (req, res) => {
            try {
                //recieve user info and reminder data
                //frontend will provide all fields
                const token = req.cookies['jwt'];
                const user = jwt.verify(token, process.env.JWT_SECRET);
                const userID = user.userid;
                const reminderID = req.body.reminderid;
                const reminderName = req.body.reminderName;
                const timezone = req.body.timezone;
                let reminderDescription = req.body.reminderDescription;
                let reminderRepeat = req.body.reminderRepeat;
                let reminderDate = req.body.reminderDate;
                let reminderTime = req.body.reminderTime;

                //validate date and time
                if (!serverValidation.isValidDate(reminderDate)) {
                    return res.status(400).json({error: 'Invalid date.'}).end();
                }
                if (!serverValidation.isValidTime(reminderTime)) {
                    return res.status(400).json({error: 'Invalid time.'}).end();
                }

                //get timestamp from the given date and time
                const reminderHours = reminderTime.split(':')[0];
                const reminderMinutes = reminderTime.split(':')[1];
                reminderDate = new Date(reminderDate);
                reminderDate.setUTCHours(reminderHours + timezone);
                reminderDate.setUTCMinutes(reminderMinutes);
                reminderDate = reminderDate.getTime();
                console.log(reminderDate);
                const reminder = {
                    reminderid: reminderID,
                    name: reminderName,
                    date: reminderDate,
                    userid: userID
                }
                //update the reminder and return the values                
                await reminderQuery.updateReminder(userID, reminderID, reminderName, reminderDescription, reminderRepeat, reminderDate);
                await emailScheduler.updateReminder(reminder, user);
                return res.status(200).json({ reminderid: reminderID, reminderName: reminderName, reminderDescription: reminderDescription, reminderRepeat: reminderRepeat, reminderDate: reminderDate }).end();
            } catch(err) {
                console.log(err);
                return res.status(500).json({error: 'Internal Server Error'}).end();
            }
        });
    
    app.route('/api/reminder/list')
        .get(upload.none(), passport.authenticate('jwt', { session: false }), async (req, res) => {
            try {
                //get user id
                const token = req.cookies['jwt'];
                const user = jwt.verify(token, process.env.JWT_SECRET);
                const userID = user.userid;

                //get all reminders and return them
                let lookup = await reminderQuery.getAllReminders(userID);
                return res.status(200).json({reminders: lookup.rows}).end();
            } catch(err) {
                console.log(err);
                return res.status(500).json({error: 'Internal Server Error'}).end();
            }            
        });    

    app.route('/api/reminder/delete')
        .delete(upload.none(), passport.authenticate('jwt', { session: false }), async (req, res) => {
            try {
                const token = req.cookies['jwt'];
                const user = jwt.verify(token, process.env.JWT_SECRET);
                const userID = user.userid;
                const reminderID = req.body.reminderid;
                
                if(!reminderID) {
                    return res.status(400).json({error: 'Missing required field!'}).end();
                }
                await reminderQuery.deleteReminder(userID, reminderID);
                await emailScheduler.deleteReminder(reminderID);
                return res.status(200).json({message: 'Reminder deleted.'}).end();
            } catch (err) {
                console.log(err);
                return res.status(500).json({error: 'Internal Server Error'}).end();
            }
        });

}