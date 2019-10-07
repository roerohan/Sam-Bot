const api = require(`./api.js`);
const commands = require(`./commands.js`);
const customStrings = require(`./strings`);

// Add user
// Add transaction
// View users
// View transactions
// View for specific user
// Finite State Machine

function isGreeting(text){
  return (/hey/i.test(text) || /hello/i.test(text) || /hi/i.test(text) || /sup/i.test(text));
}

function isAddUser(text){
  return (/add user/i.test(text));
}

function isAddTransaction(text){
  return (/add transaction/i.test(text));
}

function isViewUsers(text){
  return (/view users/i.test(text));
}

function isViewTransactions(text){
  return (/view transactions/i.test(text));
}

function isAddBudget(text){
  return (/add budget/i.test(text));
}

function isRemoveUser(text){
  return (/remove user/i.test(message.text));
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
      switch (true) {
          
        case isGreeting(message.text):
          api.sendMessage({
            chat_id: message.chat.id,
            text: customStrings.sayHello,
          });
          break;

        case isAddUser(message.text):
          api.sendMessage({
            chat_id: message.chat.id,
            text: customStrings.askName,
            reply_markup: JSON.stringify({
              force_reply: true
            })
          });
          break;
          
        case isAddTransaction(message.text):
          api.sendMessage({
            chat_id: message.chat.id,
            text: customStrings.askNameTransaction,
            reply_markup: JSON.stringify({
              force_reply: true
            })
          });
          break;

        case isViewUsers(message.text):
          let reply = await commands.viewUsers(user);

          api.sendMessage({
            chat_id: message.chat.id,
            text: reply,
          });
          break;

        case isViewTransactions(message.text):
          let reply = await commands.viewTransactions(user);

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
