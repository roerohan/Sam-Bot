// amount.schema.js

const mongoose = require('mongoose');

var shareAmountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    }
});

// Export the schema
module.exports = shareAmountSchema;
