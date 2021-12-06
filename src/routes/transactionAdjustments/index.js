const deleteTransactionAdjustment = require('./delete');
const getTransactionAdjustment = require('./get');
const listTransactionAdjustment = require('./list');
const patchTransactionAdjustment = require('./patch');
const postTransactionAdjustment = require('./post');

module.exports = [
    deleteTransactionAdjustment,
    getTransactionAdjustment,
    listTransactionAdjustment,
    patchTransactionAdjustment,
    postTransactionAdjustment
]
