const api = require(`./api.js`);
const commands = require(`./commands.js`);
const customStrings = require(`./strings`)

// Add user
// Add transaction
// View users
// View transactions
// View for specific user
// Finite State Machine

api.on(`message`, async (message) => {

  console.log(message);

  try {

    var user = getUser(message);

    if (message.from.is_bot) {
      return;
    }

    if (message.text === `/start`) {

      if (await commands.checkUserRegistered(user)) {

        api.sendMessage({
          chat_id: message.chat.id,
          text: customStrings.welcomeBack,
          reply_markup: JSON.stringify({
            keyboard: customStrings.commandList,
            one_time_keyboard: true,
            resize_keyboard: true
          })
        })

      }

    } else if (message.reply_to_message && message.reply_to_message.from.is_bot) {

      if (/cancel/i.test(message.text)) {

        api.sendMessage({
          chat_id: message.chat.id,
          text: customStrings.actionAborted,
        });
        return;

      }

      if (message.reply_to_message.text === customStrings.askName) {

        if (await addUser(user, message)) {
          api.sendMessage({
            chat_id: message.chat.id,
            text: customStrings.userAdded
          });
        } else {
          api.sendMessage({
            chat_id: message.chat.id,
            text: customStrings.nameExists
          });
        }
      } else if (message.reply_to_message.text === customStrings.askNameTransaction) {

        // input

        api.sendMessage({
          chat_id: message.chat.id,
          text: customStrings.askAmount,
          reply_markup: JSON.stringify({
            force_reply: true
          })
        });

      } else if (message.reply_to_message.text === customStrings.askAmount) {

        // input

        api.sendMessage({
          chat_id: message.chat.id,
          text: customStrings.askDescription,
          reply_markup: JSON.stringify({
            force_reply: true
          })
        });

      } else if (message.reply_to_message.text === customStrings.askDescription) {

        // input

        api.sendMessage({
          chat_id: message.chat.id,
          text: customStrings.transactionAdded,
        });

      }

    } else {

      if (/hey/i.test(message.text) || /hello/i.test(message.text) || /hi/i.test(message.text) || /sup/i.test(message.text)) {

        api.sendMessage({
          chat_id: message.chat.id,
          text: customStrings.sayHello,
        });

      } else if (/add user/i.test(message.text)) {

        api.sendMessage({
          chat_id: message.chat.id,
          text: customStrings.askName,
          reply_markup: JSON.stringify({
            force_reply: true
          })
        });

      } else if (/add transaction/i.test(message.text)) {

        api.sendMessage({
          chat_id: message.chat.id,
          text: customStrings.askNameTransaction,
          reply_markup: JSON.stringify({
            force_reply: true
          })
        });

      } else if (/view users/i.test(message.text)) {

        let reply = await commands.viewUsers(user);

        api.sendMessage({
          chat_id: message.chat.id,
          text: reply,
        });

      } else if (/view transactions/i.test(message.text)) {

        let reply = await commands.viewTransactions(user);

        api.sendMessage({
          chat_id: message.chat.id,
          text: reply,
        });

      }

      // else if (/remove user/i.test(message.text)) {

      // TODO: remove user

      // } else if (/add budget/i.test(message.text)) {

      // TODO: add budget functionality

      // }
      else {

        await api.sendMessage({
          chat_id: message.chat.id,
          text: customStrings.understandFailure,
          reply_markup: JSON.stringify({
            keyboard: customStrings.commandList,
            one_time_keyboard: true,
            resize_keyboard: true
          })
        });

      }
    }
  } catch (e) {
    console.log(`Error: ${e}`)
  }

});

getUser = (message) => {
  var user = {};
  user.username = message.from.username;
  user.name = `${message.from.first_name} ${message.from.last_name}`
  user.chat_id = message.from.id;

  return user;
}
