const getTransactionAdjustment = require('./get');
const listTransactionAdjustment = require('./list');
const patchTransactionAdjustment = require('./patch');
const postTransactionAdjustment = require('./post');

module.exports = [
    getTransactionAdjustment,
    listTransactionAdjustment,
    patchTransactionAdjustment,
    postTransactionAdjustment
]
