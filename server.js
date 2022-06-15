const express = require('express');
require('dotenv').config();
const { PORT } = process.env;

const app = express();

// Error handling
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(500).send('Internal Server Error');
});

app.listen(PORT, ()=> {
    console.log(`Listening to port ${PORT}`)
});