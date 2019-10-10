const api = require(`./api`);
const commands = require(`./commands`);
const strings = require(`./strings`);

// Add user
// Add transaction
// View users
// View transactions
// View for specific user
// Finite State Machine

function isGreeting(text) {
  return (/hey/i.test(text) || /hello/i.test(text) || /hi/i.test(text) || /sup/i.test(text));
}

function isAddUser(text) {
  return (/add user/i.test(text));
}

function isAddTransaction(text) {
  return (/add transaction/i.test(text));
}

function isViewUsers(text) {
  return (/view users/i.test(text));
}

function isViewTransactions(text) {
  return (/view transactions/i.test(text));
}

function isAddBudget(text) {
  return (/add budget/i.test(text));
}

function isRemoveUser(text) {
  return (/remove user/i.test(text));
}

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
          text: strings.welcomeBack,
          reply_markup: JSON.stringify({
            keyboard: strings.commandList,
            one_time_keyboard: true,
            resize_keyboard: true
          })
        })

      }

    } else if (message.reply_to_message && message.reply_to_message.from.is_bot) {

      if (/cancel/i.test(message.text)) {

        api.sendMessage({
          chat_id: message.chat.id,
          text: strings.actionAborted,
        });
        return;

      }

      if (message.reply_to_message.text === strings.askName) {

        if (await commands.addUser(user, message)) {
          api.sendMessage({
            chat_id: message.chat.id,
            text: strings.userAdded
          });
        } else {
          api.sendMessage({
            chat_id: message.chat.id,
            text: strings.nameExists
          });
        }
      } else if (message.reply_to_message.text === strings.askNameTransaction) {

        // input

        api.sendMessage({
          chat_id: message.chat.id,
          text: strings.askAmount,
          reply_markup: JSON.stringify({
            force_reply: true
          })
        });

      } else if (message.reply_to_message.text === strings.askAmount) {

        // input

        api.sendMessage({
          chat_id: message.chat.id,
          text: strings.askDescription,
          reply_markup: JSON.stringify({
            force_reply: true
          })
        });

      } else if (message.reply_to_message.text === strings.askDescription) {

        // input

        api.sendMessage({
          chat_id: message.chat.id,
          text: strings.transactionAdded,
        });

      }
    } else {

      let reply = ``;

      switch (true) {
        case isGreeting(message.text):
          api.sendMessage({
            chat_id: message.chat.id,
            text: strings.sayHello,
          });
          break;

        case isAddUser(message.text):
          api.sendMessage({
            chat_id: message.chat.id,
            text: strings.askName,
            reply_markup: JSON.stringify({
              force_reply: true
            })
          });
          break;

        case isAddTransaction(message.text):
          api.sendMessage({
            chat_id: message.chat.id,
            text: strings.askNameTransaction,
            reply_markup: JSON.stringify({
              force_reply: true
            })
          });
          break;

        case isViewUsers(message.text):
          reply = await commands.viewUsers(user);

          api.sendMessage({
            chat_id: message.chat.id,
            text: reply,
          });
          break;

        case isViewTransactions(message.text):
          reply = await commands.viewTransactions(user);

          api.sendMessage({
            chat_id: message.chat.id,
            text: reply,
          });
          break;

        case isAddBudget(message.text):
          // TODO: AddBudget
          break;

        case isRemoveUser(message.text):
          // TODO: RemoveUser
          break;

        default:
          await api.sendMessage({
            chat_id: message.chat.id,
            text: strings.understandFailure,
            reply_markup: JSON.stringify({
              keyboard: strings.commandList,
              one_time_keyboard: true,
              resize_keyboard: true
            })
          });
          break;
      }
    }
  } catch (e) {
    console.log(`Error: ${e}`);
  }

});



getUser = (message) => {
  var user = {};
  user.username = message.from.username;
  user.name = `${message.from.first_name} ${message.from.last_name}`
  user.chat_id = message.from.id;

  return user;
}
