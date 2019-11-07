// transaction.schema.js

const mongoose = require('mongoose');

var transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    other: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    }
});

module.exports = {
    schema: transactionSchema,
    model: mongoose.model('Transaction', transactionSchema)
};
