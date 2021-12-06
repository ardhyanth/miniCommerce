const productRoutes = require('./products');
const transactionAdjustmentRoutes = require('./transactionAdjustments');
const eleveniaRoutes = require('./elevania')
const orderRoutes = require('./orders')

exports.plugin = {
    async register(server, options) {
        server.route([
            ...productRoutes,
            ...transactionAdjustmentRoutes,
            ...eleveniaRoutes,
            ...orderRoutes
        ]);
    },
    version: require('../../package.json').version,
    name: 'routes'
};
