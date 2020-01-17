const api = require('./api');
const commands = require('./commands');
const strings = require('./strings');

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
  return (/(add|new|create).*(user|account|participant|friend)/i.test(text));
}

function isAddTransaction(text) {
  return (/(add|new|create).*(transaction|payment)/i.test(text));
}

function isViewUsers(text) {
  return (/(view|see|show|who).*(users|accounts|participants|friends)/i.test(text));
}

function isViewTransactions(text) {
  return (/(view|see|show|who).*(transaction|payment)/i.test(text));
}

function isAddBudget(text) {
  return (/(what's|what is).*(budget|money|details)/i.test(text));
}

function isRemoveUser(text) {
  return (/(remove|delete).*(user|friend|participant|account)/i.test(text));
}

function isCheckPayableAmount(text) {
  return (/(((how much).*(owe))|credit|debit|calculate|(see|show.*due))|outstanding|debt|payable|amount/i.test(text));
}

const getUser = (message) => {
  const user = {};
  user.username = message.from.username || message.from.id || '';
  user.name = `${message.from.first_name} ${message.from.last_name || ''}`;
  user.chat_id = message.from.id;

  return user;
};

api.on('message', async (message) => {
  console.log(message);

  try {
    const user = getUser(message);

    if (message.from.is_bot) {
      return;
    }

    if (message.text === '/start') {
      if (await commands.checkUserRegistered(user)) {
        api.sendMessage({
          chat_id: message.chat.id,
          text: strings.welcomeBack,
          reply_markup: JSON.stringify({
            keyboard: strings.commandList,
            one_time_keyboard: true,
            resize_keyboard: true,
          }),
        });
      }
    } else if (message.reply_to_message && message.reply_to_message.from.is_bot) {
      if (/(cancel|stop)/i.test(message.text)) {
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
            text: strings.userAdded,
          });
        } else {
          api.sendMessage({
            chat_id: message.chat.id,
            text: strings.nameExists,
          });
        }
      } else if (message.reply_to_message.text === strings.askTransactionDetails) {
        if (await commands.addTransactions(user, message)) {
          api.sendMessage({
            chat_id: message.chat.id,
            text: strings.transactionAdded,
          });
        } else {
          api.sendMessage({
            chat_id: message.chat.id,
            text: strings.failureMessage,
          });
        }
      } else if (message.reply_to_message.text === strings.askNameCalculate) {
        const reply = await commands.calcPayable(user, message);
        if (reply) {
          api.sendMessage({
            chat_id: message.chat.id,
            text: reply,
          });
        } else {
          api.sendMessage({
            chat_id: message.chat.id,
            text: strings.failureMessage,
          });
        }
      }
    } else {
      let reply = '';

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
              force_reply: true,
            }),
          });
          break;

        case isAddTransaction(message.text):
          api.sendMessage({
            chat_id: message.chat.id,
            text: strings.askTransactionDetails,
            reply_markup: JSON.stringify({
              force_reply: true,
            }),
          });
          break;

        case isViewUsers(message.text):
          await api.sendMessage({
            chat_id: message.chat.id,
            text: 'Finding Users...',
          });
          reply = await commands.viewUsers(user);

          api.sendMessage({
            chat_id: message.chat.id,
            text: reply,
          });
          break;

        case isViewTransactions(message.text):

          await api.sendMessage({
            chat_id: message.chat.id,
            text: 'Finding Transactions...',
          });

          reply = await commands.viewTransactions(user);

          api.sendMessage({
            chat_id: message.chat.id,
            text: reply,
          });
          break;

        case isCheckPayableAmount(message.text):
          await api.sendMessage({
            chat_id: message.chat.id,
            text: strings.askNameCalculate,
            reply_markup: JSON.stringify({
              force_reply: true,
            }),
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
              resize_keyboard: true,
            }),
          });
          break;
      }
    }
  } catch (e) {
    console.log(`Error in index.js, Line 216: ${e}`);
  }
});
