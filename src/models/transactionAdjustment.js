const Joi = require('joi');

const Schwifty = require('@hapipal/schwifty');

class TransactionAdjustment extends Schwifty.Model {
    static tableName = 'transaction_adjustments';

    static joiSchema = Joi.object({
        sku: Joi.string().required(),
        qty: Joi.number().required(),
        amount: Joi.number()
    });
}

module.exports = TransactionAdjustment;
