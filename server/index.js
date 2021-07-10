const express = require('express');

const app = express();
const port = process.env.PORT || 3001;
const apiRoutes = require('./routes/api.js');

app.get('/', (req, res) => {
    res.send('Hello World!');
})

apiRoutes(app);

app.listen(port, () => {
    console.log(`Reminder app listening on port: ${port}`);
})