const productModel = require('./product');
const transactionAdjustmentModel = require('./transactionAdjustment');
const orderModel = require('./order');
const Pack = require('../../package.json').version;

const models = [
  productModel,
  transactionAdjustmentModel,
  orderModel,
];

const plugins = {
  async register(server) {
    models.forEach((model) => model.setLogger(server.logger));

    server.registerModel(models);
  },
  version: Pack,
  name: 'models',
};

module.exports = plugins;
