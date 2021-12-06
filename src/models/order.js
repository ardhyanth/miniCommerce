const Joi = require('joi');

const Schwifty = require('@hapipal/schwifty');

class Order extends Schwifty.Model {
    static tableName = 'orders';

    static joiSchema = Joi.object({
        id: Joi.number(),
        sku: Joi.string(),
        qty: Joi.number(),
        status: Joi.string()
    });
}

module.exports = Order;
