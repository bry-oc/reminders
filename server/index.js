const express = require('express');
const passport = require('passport');

const app = express();
const port = process.env.PORT || 3001;
const apiRoutes = require('./routes/api.js');

app.use(express.json());
app.use(express.urlencoded());
app.use(passport.initialize());

app.get('/', (req, res) => {
    res.send('Hello World!');
})

apiRoutes(app);

app.listen(port, () => {
    console.log(`Reminder app listening on port: ${port}`);
})