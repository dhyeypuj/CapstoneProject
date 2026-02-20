const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    V7: Number,
    V8: Number,
    V9: Number,
    Amount: Number,
    isFraud: Boolean,
    riskScore: Number
}, { strict: false });

module.exports = mongoose.model('Transaction', transactionSchema, 'transactions');