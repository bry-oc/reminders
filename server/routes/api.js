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
const { authenticate } = require('passport');
require('dotenv').config();

//sign up
//sign in
//crud reminders
module.exports = function (app) {
    //jwt tokens stored in cookies
    const upload = multer();
    /*
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
    */
    //authorization
    const authorization = async (req, res, next) => {
        try {
            let token;
            let user;
            if (req && req.cookies) {
                token = req.cookies['jwt'];
            }
            if (!token) {
                return res.status(401).json({ error: 'Unauthorized' }).end();
            }
            const data = jwt.verify(token, process.env.JWT_SECRET);
            if (!data.userid) {
                return res.status(401).json({ error: 'Unauthorized' }).end();
            }
            user = data;
            return next();
        } catch (err) {
            return res.status(401).json({ error: 'Unauthorized' }).end();
        }
        
    }
    
    //sign up and login routes
    //account creation
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
                        //set two day expiration
                        const expirationDate = new Date().getTime() + 1000 * 60 * 60 * 24 * 2;
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
    
    //account creation and email verification 
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
                return res.status(500).json({error: 'Internal Server Error: ' +err}).end();
            }
        });
    
    //resend email verification
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
                    //set two day expiration
                    const expirationDate = new Date().getTime() + 1000 * 60 * 60 * 24 * 2;
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
                return res.status(500).json({ error: 'Internal Server Error: ' + err}).end();
            }
        });
    
    //login
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
                        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10s" });
                        jti = crypto.randomBytes(16).toString('hex');
                        const refreshPayload = { jti: jti, userid: user.userid, username: user.username, email: user.email }
                        const refreshToken = jwt.sign(refreshPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: "14d"} );
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
                return res.status(500).json({ error: 'Internal Server Error: ' + err}).end();
            }
        });
    
    app.route('/api/profile')
        .get(authorization, (req, res) => {
            res.json({message: 'Access granted.'});
        });
    
    //renew access token by verifying refresh token
    //check the refresh token blacklist to ensure refresh token is still valid
    //issue a renewed access token
    app.route('/api/token/refresh')
        .get(async (req, res) => {
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
                    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10s" });
                    res.cookie('jwt', token, { httpOnly: true, sameSite: true });
                    res.json({ success: true, token: token }).end();;
                }
            } catch (err) {
                if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
                    res.clearCookie('refresh');
                    return res.status(401).json({error: 'Invalid Refresh Token'}).end();
                }
                return res.status(500).json({ error: 'Internal Server Error: ' + err}).end();
            }
        });
    
    //admins can revoke refresh tokens by blacklisting them
    //the user will need to login again to generate a new refresh token
    app.route('/api/token/revoke')
        .post(authorization, async (req, res) => {
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
                return res.status(500).json({ error: 'Internal Server Error: ' + err}).end();
            }    
        });
    //reset password request
    app.route('/api/user/password/reset')
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
                    return res.status(400).json({error: 'User does not exist.'});
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
                        text: 'Hello ' + username + ',\n\nA password reset was requested. Please reset your password by clicking the link: \nhttp://localhost:3000/password/reset/' + userID + '\nYour password reset token is: ' + token + '\nThis token will expire in two days.  If this password reset was not requested by you, please ignore this email.'
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
                return res.status(500).json({ error: 'Internal Server Error: ' + err}).end();
            }
        });
    //reset password
    app.route('/api/password/reset/:userid')
        .post(upload.none(), async (req, res) => {
            try {
                //receive new password
                const password = req.body.password;
                const userID = req.params.userid;
                const token = req.body.token;
                const timestamp = new Date().getTime();
                if(!password) {
                    return res.status(400).json({error: 'Missing required field!'}).end();
                }
                if (!serverValidation.isValidPassword(password)) {
                    return res.status(400).json({ error: 'Invalid password.' }).end();
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
                return res.status(500).json({ error: 'Internal Server Error: ' + err}).end();
            }
        });
    //update username
    app.route('/api/user/username/update')
        .post(upload.none(), authorization, async (req, res) => {
            try {
                //receive user and new username
                const token = req.cookies['jwt'];
                const user = jwt.verify(token, process.env.JWT_SECRET);
                const userID = user.userid;
                const username = req.body.username;
                
                if (!username) {
                    return res.status(400).json({ error: 'Missing required field!' }).end();
                }

                if (!serverValidation.isValidUsername(username)) {
                    return res.status(400).json({ error: 'Invalid username.' }).end();
                }
                //lookup username in user table
                let lookup = await userQuery.getUserByUsername(username);
                if (lookup.rowCount > 0) {
                    //username is already being used
                    return res.status(404).json({ error: 'That username is already being used.' }).end();
                } else {
                    //update the user's username
                    await authQuery.updateUsername(userID, username);
                    const jti = crypto.randomBytes(16).toString('hex');
                    const payload = { jti: jti, userid: user.userid, username: username, email: user.email }
                    const updateToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10s" });
                    res.clearCookie('jwt');
                    res.cookie('jwt', updateToken, { httpOnly: true, sameSite: true });
                    return res.status(200).json({ success: true, message: 'Your username has been changed to ' + username + "."});
                }
                
            } catch (err) {
                return res.status(500).json({ error: 'Internal Server Error: ' + err}).end();
            }
        });
    //update email
    app.route('/api/user/email/update')
        .post(upload.none(), authorization, async (req, res) => {
            try {
                //receive user and new email
                const token = req.cookies['jwt'];
                const user = jwt.verify(token, process.env.JWT_SECRET);
                const userID = user.userid;
                const email = req.body.email;

                if (!email) {
                    return res.status(400).json({ error: 'Missing required field!' }).end();
                }

                if (!serverValidation.isValidEmail(email)) {
                    return res.status(400).json({ error: 'Invalid email.' }).end();
                }
                //lookup email in user table
                let lookup = await userQuery.getUserByEmail(email);
                if (lookup.rowCount > 0) {
                    //email is already being used
                    return res.status(404).json({ error: 'That email is already being used.' }).end();
                } else {
                    //update the user's email
                    await authQuery.updateEmail(userID, email);
                    const jti = crypto.randomBytes(16).toString('hex');
                    const payload = { jti: jti, userid: user.userid, username: user.username, email: email }
                    const updateToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10s" });
                    res.clearCookie('jwt');
                    res.cookie('jwt', updateToken, { httpOnly: true, sameSite: true });
                    return res.status(200).json({ success: true, message: 'Your email has been changed to ' + email + "." });
                }
            } catch (err) {
                return res.status(500).json({ error: 'Internal Server Error: ' + err}).end();
            }
        });
    //update password
    app.route('/api/user/password/update')
        .post(upload.none(), authorization, async (req, res) => {
            try {
                //receive user and new password
                const token = req.cookies['jwt'];
                const user = jwt.verify(token, process.env.JWT_SECRET);
                const userID = user.userid;
                const password = req.body.password;

                if (!password) {
                    return res.status(400).json({ error: 'Missing required field!' }).end();
                }

                if (!serverValidation.isValidPassword(password)) {
                    return res.status(400).json({ error: 'Invalid password.' }).end();
                }
                //update the user's password
                const passwordHash = await argon2.hash(password);
                await authQuery.updatePassword(userID, passwordHash);
                return res.status(200).json({ success: true, message: 'Your password has been successfuly updated.' });
            } catch (err) {
                return res.status(500).json({ error: 'Internal Server Error: ' + err}).end();
            }
        });
    //user account deletion
    app.route('/api/user/account/delete')
        .delete(upload.none(), authorization, async (req, res) => {
            try {
                //get user
                const token = req.cookies['jwt'];
                const user = jwt.verify(token, process.env.JWT_SECRET);
                const userID = user.userid;
                //delete all reminders
                await reminderQuery.deleteAllReminders(userID);
                //delete account
                await authQuery.deleteUser(userID);
                //delete cookies
                res.clearCookie('refresh');
                res.clearCookie('jwt');
                return res.status(200).json({ message: 'Account deleted.' }).end();
            } catch (err) {
                return res.status(500).json({ error: 'Internal Server Error: ' + err}).end();
            }
        });

    //reminder routes
    //create reminders
    app.route('/api/reminder/create')
        .post(upload.none(), authorization, async (req, res) => {
            try {
                //receieve user info and reminder data
                const token = req.cookies['jwt'];
                const user = jwt.verify(token, process.env.JWT_SECRET);
                const userID = user.userid;
                const reminderName = req.body.reminderName;
                let reminderDescription = req.body.reminderDescription;
                let reminderRepeat = req.body.reminderRepeat;
                let reminderDate = req.body.reminderDate;
                let reminderTime = req.body.reminderTime;  

                //return error if required fields are missing
                if(!userID || !reminderName || !reminderDate || !reminderTime ) {
                    console.log(userID);
                    console.log(reminderName);
                    console.log(reminderDate);
                    console.log(reminderTime);
                    return res.status(400).json({error: 'Missing required field(s)!'}).end();
                }

                //validate date and time
                if(!serverValidation.isValidDate(reminderDate)) {
                    console.log(reminderDate);
                    return res.status(400).json({error: 'Invalid date.'}).end();
                }
                if(!serverValidation.isValidTime(reminderTime)) {
                    return res.status(400).json({error: 'Invalid time.'}).end();
                }

                //set default values for optional parameters if not provided
                if(!reminderRepeat) {
                    reminderRepeat = 'none';
                }
                if(!reminderDescription) {
                    reminderDescription = '';
                }

                //get timestamp from the given date and time
                const reminderHours = reminderTime.split(':')[0];
                const reminderMinutes = reminderTime.split(':')[1];
                reminderDate = new Date(reminderDate);
                reminderDate.setHours(reminderHours);
                reminderDate.setMinutes(reminderMinutes);
                reminderDate = reminderDate.getTime();               
                                
                //create the reminder and return its id
                let lookup = await reminderQuery.createReminder(userID, reminderName, reminderDescription, reminderRepeat, reminderDate);
                const reminderID = lookup.rows[0].reminderid;


                //create job for the reminder email
                const reminder = {
                    reminderid: reminderID,
                    name: reminderName,
                    date: reminderDate,
                    userid: userID
                }

                await emailScheduler.createReminder(user, reminder);
                return res.status(200).json({ success: true, reminderid: reminderID }).end();
            } catch(err) {
                console.log(err);
                return res.status(500).json({ error: 'Internal Server Error: ' + err}).end();
            }
        });
    //update reminder
    app.route('/api/reminder/update')
        .post(upload.none(), authorization, async (req, res) => {
            try {
                //recieve user info and reminder data
                //frontend will provide all fields
                const token = req.cookies['jwt'];
                const user = jwt.verify(token, process.env.JWT_SECRET);
                const userID = user.userid;
                const reminderID = req.body.reminderid;
                const reminderName = req.body.reminderName;
                let reminderDescription = req.body.reminderDescription;
                let reminderRepeat = req.body.reminderRepeat;
                let reminderDate = req.body.reminderDate;
                let reminderTime = req.body.reminderTime;

                //return error if any fields are missing
                if (!userID || !reminderID || !reminderName || !reminderDate || !reminderTime || reminderDescription === null || reminderDescription === undefined || !reminderRepeat) {
                    console.log(reminderID);
                    console.log(reminderName);
                    console.log(reminderDate);
                    console.log(reminderTime);
                    console.log(reminderRepeat);
                    console.log(reminderDescription);
                    return res.status(400).json({ error: 'Missing required field(s)!' }).end();
                }

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
                let reminderTimestamp = new Date(reminderDate);
                reminderTimestamp.setHours(reminderHours);
                reminderTimestamp.setMinutes(reminderMinutes);
                reminderTimestamp = reminderTimestamp.getTime();
                
                const reminder = {
                    reminderid: reminderID,
                    name: reminderName,
                    date: reminderTimestamp,
                    userid: userID
                }
                //update the reminder and return the values                
                await reminderQuery.updateReminder(userID, reminderID, reminderName, reminderDescription, reminderRepeat, reminderTimestamp);
                await emailScheduler.updateReminder(reminder, user);
                return res.status(200).json({ success: true, reminderid: reminderID, reminderName: reminderName, reminderDescription: reminderDescription, reminderRepeat: reminderRepeat, reminderTimestamp: reminderTimestamp, reminderDate: reminderDate, reminderTime: reminderTime }).end();
            } catch(err) {
                console.log(err);
                return res.status(500).json({ error: 'Internal Server Error: ' + err}).end();
            }
        });
    //list reminders
    app.route('/api/reminder/list')
        .get(authorization, async (req, res) => {
            try {
                //get user id
                const token = req.cookies['jwt'];
                const user = jwt.verify(token, process.env.JWT_SECRET);
                const userID = user.userid;

                //get all reminders and return them
                let lookup = await reminderQuery.getAllReminders(userID);
                return res.status(200).json({success: true, reminders: lookup.rows}).end();
            } catch(err) {
                console.log(err);
                return res.status(500).json({ error: 'Internal Server Error: ' + err}).end();
            }            
        });    
    //view reminder
    app.route('/api/reminder/view/:reminderid')
        .get(authorization, async (req, res) => {
            try {
                //get userid
                const token = req.cookies['jwt'];
                const user = jwt.verify(token, process.env.JWT_SECRET);
                const userID = user.userid;
                const reminderID = req.params.reminderid;
                //get reminder and return
                const lookup = await reminderQuery.getReminder(reminderID, userID);
                const reminder = lookup.rows[0];

                return res.status(200).json({ success: true, reminderid: reminder.reminderid, reminderName: reminder.name, reminderDescription: reminder.description, reminderRepeat: reminder.repeat, reminderTimestamp: reminder.date }).end();
            } catch(err) {
                console.log(err);
                return res.status(500).json({ error: 'Internal Server Error: ' + err}).end();
            }
        })
    //delete reminders
    app.route('/api/reminder/delete/:reminderid')
        .delete(upload.none(), authorization, async (req, res) => {
            try {
                //get user and reminder id
                const token = req.cookies['jwt'];
                const user = jwt.verify(token, process.env.JWT_SECRET);
                const userID = user.userid;
                const reminderID = parseInt(req.params.reminderid);
                //return error if reminder id is invalid
                if(!reminderID || typeof(reminderID) != 'number') {
                    return res.status(400).json({error: 'Invalid reminder id.'}).end();
                }
                //delete reminder and the scheduled email
                await reminderQuery.deleteReminder(userID, reminderID);
                await emailScheduler.deleteReminder(reminderID);
                return res.status(200).json({success: true, message: 'Reminder deleted.'}).end();
            } catch (err) {
                return res.status(500).json({ error: 'Internal Server Error: ' + err}).end();
            }
        });
    
    //verify the user is logged in
    app.route('/api/user/authentication')
        .get(authorization, async (req, res) => {
            try {
                return res.status(200).json({ success: true, loggedIn: true }).end();
            } catch (err) {
                return res.status(500).json({ error: 'Internal Server Error: ' + err}).end();
            }
        });
    
    app.route('/api/logout')
        .get(async (req, res) => {
            try {
                const refreshToken = req.cookies['refresh'];
                //blacklist their refresh token
                //store jti and expiration timestamp of the token
                const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                const refreshJTI = decodedRefreshToken.jti;
                const refreshExpirationDate = decodedRefreshToken.exp;
                await authQuery.blacklistRefreshToken(refreshJTI, refreshExpirationDate);
                //clear the user's cookies
                res.clearCookie('refresh');
                res.clearCookie('jwt');
                return res.status(200).json({ success: true, message: 'User successfully logged out.' }).end();
            } catch (err) {
                return res.status(500).json({ error: 'Internal Server Error: ' + err }).end();
            }
        });
    
    app.route('/api/user/account')
        .get(authorization, async (req, res) => {
            try {
                const token = req.cookies['jwt'];
                const user = jwt.verify(token, process.env.JWT_SECRET);
                return res.status(200).json({success: true, username: user.username, email: user.email});
            } catch (err) {
                return res.status(500).json({ error: 'Internal Server Error: ' + err }).end();
            }
        })
}