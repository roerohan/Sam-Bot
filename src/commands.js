/* eslint-disable no-restricted-syntax */
require('../models/db');

const User = require('../models/user.model');
const Transaction = require('../models/transaction.schema').model;
const strings = require('./strings');

const checkUserRegistered = async (user) => {
  try {
    const doc = await User.findOne({
      username: user.username,
    });

    if (!doc) {
      const userObj = new User();
      userObj.name = user.name.toString();
      userObj.username = user.username.toString();
      userObj.chat_id = user.chat_id.toString();
      userObj.budget = 0;
      userObj.others = [];
      userObj.sharedAmounts = [];
      userObj.transactions = [];

      userObj.save();
      return false;
    }
  } catch (e) {
    console.log(`Error in checkUserRegistered: ${e}`);
  }
  return true;
};

const addUser = async (user, message) => {
  let info = true;
  try {
    const name = message.text.toString();

    const doc = await User.findOne({
      username: user.username,
    });

    if (doc.others.map((element) => element.toLowerCase()).indexOf(name.toLowerCase()) > -1) {
      info = false;
      return info;
    }

    await User.findOneAndUpdate({
      username: user.username,
    }, {
      $push: {
        others: name,
      },
    });
  } catch (e) {
    console.log(`Error in addUser: ${e}`);
    return strings.serverError;
  }
  return info;
};

const addTransactions = async (user, message) => {
  const temp = message.text.split(',').map((string) => string.trim());
  const transactionInfo = new Transaction();
  [
    transactionInfo.amount, transactionInfo.other, transactionInfo.date, transactionInfo.details,
  ] = temp;

  try {
    const doc = await User.find({
      username: user.username,
    });

    if (!doc) {
      const reply = strings.notRegistered;
      return reply;
    }

    await User.findOneAndUpdate({
      username: user.username,
    }, {
      $push: {
        transactions: transactionInfo,
      },
    });
  } catch (e) {
    console.log(`Error in addTransactions: ${e}`);
    return false;
  }
  return true;
};

const viewUsers = async (user) => {
  let reply = '';
  try {
    const doc = await User.findOne({
      username: user.username,
    });

    if (!doc) {
      reply = 'You must register yourself with the bot first, try: \'/start\'';
      return reply;
    }

    reply = (doc.others.length !== 0) ? `These are the users you have added: \n${doc.others.join('\n')}` : 'You have not added any users yet.';
  } catch (e) {
    console.log(`Error in viewUsers: ${e}`);
    return strings.serverError;
  }

  return reply;
};

const viewTransactions = async (user) => {
  let reply = '';
  try {
    const doc = await User.findOne({
      username: user.username,
    });

    if (!doc) {
      reply = 'You must register yourself with the bot first, try: \'/start\'';
      return reply;
    }
    console.log(doc.transactions);
    let toSend = '';
    // eslint-disable-next-line guard-for-in
    for (const i in doc.transactions) {
      const name = doc.transactions[i].other;
      const description = doc.transactions[i].details;
      const { amount } = doc.transactions[i];
      const { date } = doc.transactions[i];
      toSend += `\n${name}\n${description}\n${amount}\n${date}\n`;
    }
    reply = (doc.transactions.length !== 0) ? `Your transactions are as follows: \n${toSend}` : 'You have not made any transactions yet.';
  } catch (e) {
    console.log(`Error in viewTransactions: ${e}`);
    return strings.serverError;
  }

  return reply;
};

const calcPayable = async (user, message) => {
  let reply = '';
  try {
    const doc = await User.findOne({
      username: user.username,
    });

    if (!doc) {
      reply = 'You must register yourself with the bot first, try: \'/start\'';
      return reply;
    }
    const person = message.text;
    let amount = 0;
    for (const i in doc.transactions) {
      if (doc.transactions[i].other.toLowerCase() === person.toLowerCase()) {
        amount += doc.transactions[i].amount;
      }
    }
    reply = (amount > 0) ? `${person} owes you Rs. ${amount}.` : `You owe ${person} an amount of Rs. ${amount}.`;
  } catch (e) {
    console.log(`Error in calcPayable: ${e}`);
    return strings.serverError;
  }
  return reply;
};

module.exports = {
  checkUserRegistered,
  addUser,
  addTransactions,
  viewUsers,
  viewTransactions,
  calcPayable,
};
