const productRoutes = require('./products');
const transactionAdjustmentRoutes = require('./transactionAdjustments');
const eleveniaRoutes = require('./elevania');
const orderRoutes = require('./orders');
const Pack = require('../../package.json').version;

exports.plugin = {
  async register(server) {
    server.route([
      ...productRoutes,
      ...transactionAdjustmentRoutes,
      ...eleveniaRoutes,
      ...orderRoutes,
    ]);
  },
  version: Pack,
  name: 'routes',
};
