const Joi = require('joi');

const handler = require('./handler');

module.exports = {
    method: 'GET',
    path: '/orders/{id}',
    options: {
        description: 'Get order detail',
        notes: 'Need to provide order ID for the endpoint',
        tags: ['api'],
        validate: {
            params: Joi.object({
                id : Joi.string()
                    .description('Product ID or SKU'),
            })
        },
    },
    handler
};
