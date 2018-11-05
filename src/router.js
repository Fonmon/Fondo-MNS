const express = require('express');
const main = require('./main');

const router = express.Router();

router.post('/send', async (req, res) => {
    console.log('Request arrived to /send endpoint');
    const invalidSubscriptions = await main.sendNotification(req.body);
    console.log(invalidSubscriptions)
    res.json({'invalid': invalidSubscriptions});
});

module.exports = router;