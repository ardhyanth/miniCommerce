const Joi = require('joi');

const Schwifty = require('@hapipal/schwifty');

class Product extends Schwifty.Model {
    static tableName = 'products';
    static joiSchema = Joi.object({
        sku: Joi.string(),
        name: Joi.string(),
        image: Joi.string(),
        price: Joi.number(),
        description: Joi.string(),
        stock: Joi.number()
    });
    static idColumn = 'sku';
}

module.exports = Product;
