var telegram = require('telegram-bot-api');
require('dotenv').config();
const APIKEY = process.env.APIKEY;

const api = new telegram({
    token: APIKEY,
    updates: {
        enabled: true
    }
});

module.exports = api;
