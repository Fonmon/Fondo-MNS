require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const router = require('./src/router');

let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/mns', router);

app.listen(9901, () => {
    console.log('MNS Server is running on port 9901')
});