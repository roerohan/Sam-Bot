require('./models/db');

const User = require('./models/user.model');
const Transaction = require('./models/transaction.schema').model;
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

addTransactions = async (user, message) => {

    const temp = message.text.split(',').map(string => string.trim());
    let transactionInfo = new Transaction();
    transactionInfo.amount = temp[0];
    transactionInfo.other = temp[1];
    transactionInfo.date = temp[2];
    transactionInfo.details = temp[3];

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
        return false;
    }
    return true;
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

        var reply = (doc.others.length !== 0) ? `These are the users you have added: \n${doc.others.join('\n')}` : `You have not added any users yet.`;

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
        console.log(doc.transactions);
        let toSend = '';
        for (i in doc.transactions) {
            let name = doc.transactions[i].other;
            let description = doc.transactions[i].details;
            let amount = doc.transactions[i].amount;
            let date = doc.transactions[i].date;
            toSend += `\n${name}\n${description}\n${amount}\n${date}\n`;
        }
        var reply = (doc.transactions.length !== 0) ? `Your transactions are as follows: \n${toSend}`: `You have not made any transactions yet.`;

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
