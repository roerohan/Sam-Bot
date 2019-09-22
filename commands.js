require('./models/db');

const User = require('./models/user.model');
const TransactionSchema = require('./models/transaction.schema');

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
        }

    } catch (e) {
        console.log(`Error: ${e}`)
    }

}

addUser = async (user, message) => {

    try {
        let info = true;
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

    try {

        var doc = await User.find({
            username: user.username
        });

    }
    catch (e) {
        console.log(`Error: ${e}`)
    }

}

viewUsers = async (user) => {

    try {
        const doc = await User.findOne({
            username: user.username
        });

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
