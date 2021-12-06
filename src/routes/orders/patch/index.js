const Joi = require('joi');

const handler = require('./handler');

module.exports = {
    method: 'PATCH',
    path: '/orders',
    options: {
        description: 'Update a orders',
        notes: 'Need to provide product ID/SKU for the endpoint',
        tags: ['api'],
        plugins: {
            'hapi-swagger': {
                payloadType: 'form'
            }
        },
        validate: {
            payload: Joi.object({
                id: Joi.number().example('11141234').description('product SKU'),
                status: Joi.string().example('accept').valid('accept', 'cancel')
            })
        },
    },
    handler
};
