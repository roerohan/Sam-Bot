// user.model.js
const sharedAmountSchema = require('./amount.schema');
const transactionSchema = require('./transaction.schema').schema;
const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    username: {
        type: String,
        required: true,
    },
    chat_id: {
        type: String,
        required: true,
    },
    budget: {
        type: Number,
    },
    others: [],
    sharedAmounts: [sharedAmountSchema],
    transactions: [transactionSchema],
});

// Export the model
module.exports = mongoose.model('User', userSchema);
