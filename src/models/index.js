const productModel = require('./product');
const transactionAdjustmentModel = require('./transactionAdjustment');
const orderModel = require('./order');

exports.plugin = {
    async register(server, options) {
        server.registerModel([
            productModel,
            transactionAdjustmentModel,
            orderModel
        ]);
    },
    version: require('../../package.json').version,
    name: 'models'
};
