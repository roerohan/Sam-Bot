const Telegram = require('telegram-bot-api');
require('dotenv').config();

const { APIKEY } = process.env;

const api = new Telegram({
  token: APIKEY,
  updates: {
    enabled: true,
  },
});

module.exports = api;
