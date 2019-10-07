require('./models/db');

const User = require('./models/user.model');
const TransactionSchema = require('./models/transaction.schema');
const strings = require('./strings');

checkUserRegistered = async (user) => {

    try {

        const doc = await User.findOne({
            username: user.username
        });

        if (!doc) {
            var user_obj = new User();
            user_obj.name = user.name.toString();
            user_obj.username = user.username.toString();
            user_obj.chat_id = user.chat_id.toString();
            user_obj.budget = 0;
            user_obj.others =
            user_obj.sharedAmounts = [];
            user_obj.transactions = [];

            user_obj.save();
            return false;
        }

        return true;

    } catch (e) {
        console.log(`Error: ${e}`)
    }

}

addUser = async (user, message) => {

    let info = true;
    try {
        const name = message.text.toString();

        const doc = await User.findOne({
            username: user.username
        });

        if (doc.others.map((element) => {
                return element.toLowerCase();
            }).indexOf(name.toLowerCase()) > -1) {

            info = false;
            return info;

        }

        await User.findOneAndUpdate({
            username: user.username
        }, {
            $push: {
                others: name
            }
        });
    }
    catch (e) {
        console.log(`Error: ${e}`)
    }
    return info;
}

/**
 * Adds a transaction to an existing user
 * Params: userSchema user, object message
 * Returns model of transaction info that was updated to the user
*/
addTransactions = async (user, message) => {

    let transactionInfo = new TransactionSchema();
    transactionInfo.name = message.text.name;
    transactionInfo.amount = message.text.amount;
    transactionInfo.other = message.text.other;
    transactionInfo.date = message.text.date;
    transactionInfo.details = message.text.details;

    try {
        const doc = await User.find({
            username: user.username
        });

        if (!doc) {
            reply = strings.notRegistered;
            return reply;
        }

        await User.findOneAndUpdate({
            username: user.username
        }, {
            "$push": {
                transactions: transactionInfo
            }
        });

    }
    catch (e) {
        console.log(`Error: ${e}`)
    }
    return transactionInfo;
}

viewUsers = async (user) => {

    try {
        const doc = await User.findOne({
            username: user.username
        });

        if (!doc) {
            reply = `You must register yourself with the bot first, try: '/start'`
            return reply;
        }

        var reply = (doc.others.length !== 0) ? `These are the users you have added: ${doc.others}` : `You have not added any users yet.`;

    } catch (e) {
        console.log(`Error: ${e}`);
    }

    return reply;

}

viewTransactions = async (user) => {

    try {
        const doc = await User.findOne({
            username: user.username
        });

        if (!doc) {
            reply = `You must register yourself with the bot first, try: '/start'`
            return reply;
        }

        var reply = (doc.transactions.length !== 0) ? `Your transactions are as follows: ${doc.transactions}`: `You have not made any transactions yet.`;

    } catch (e) {
        console.log(`Error: ${e}`);
    }

    return reply;

}

module.exports = {
    checkUserRegistered: checkUserRegistered,
    addUser: addUser,
    addTransactions: addTransactions,
    viewUsers: viewUsers,
    viewTransactions: viewTransactions,
}
