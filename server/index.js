const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const schedule = require('node-schedule');

const app = express();
const port = process.env.PORT || 3001;
const apiRoutes = require('./routes/api.js');
const emailScheduler = require('./tools/emailScheduler');
const db = require('./db/dbScheduler');


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(cookieParser());
db.deleteExpiredRows();
emailScheduler.initializeAllReminders();
emailScheduler.checkMissedReminders();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

apiRoutes(app);

app.listen(port, () => {
    console.log(`Reminder app listening on port: ${port}`);
});

module.exports = app