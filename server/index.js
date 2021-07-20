const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3001;
const apiRoutes = require('./routes/api.js');
const emailScheduler = require('./tools/emailScheduler');


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(cookieParser());
emailScheduler.checkMissedReminders();


app.get('/', (req, res) => {
    res.send('Hello World!');
})

apiRoutes(app);

app.listen(port, () => {
    console.log(`Reminder app listening on port: ${port}`);
})