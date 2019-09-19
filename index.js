var telegram = require('telegram-bot-api')
require('dotenv').config();
const API_token = process.env.API_TOKEN
console.log(API_token)
var api = new telegram({
  token: API_token,
  updates: {
    enabled: true
  }
});


api.on('message', function (message) {
  console.log(message); // Received text message
  if (message.text === '/start') {
    console.log(message);
    api.sendMessage({
      chat_id: message.chat.id,
      text: 'HelloWorld'
    });
  } else if (/hey /i.test(message.text) || /hello /i.test(message.text) || /hi /i.test(message.text)) {
    // api.sendDocument({
    //   chat_id: message.chat.id,
    //   document: "assets/giphy.gif"
    // });
    api.sendMessage({
      chat_id: message.chat.id,
      text: 'Hi there!'
    });
  } else
    api.sendMessage({
      chat_id: message.chat.id,
      text: `I don't understand`
    });
});
