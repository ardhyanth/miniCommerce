const Joi = require('joi');

module.exports = {
    method: 'GET',
    path: '/products/{id}',
    options: {
        description: 'Get products detail',
        notes: 'Need to provide product ID/SKU for the endpoint',
        tags: ['api'],
        validate: {
            params: Joi.object({
                id : Joi.string()
                    .description('Product ID or SKU'),
            })
        },
    },
    handler: async (request, h) => {
        const { Product } = request.server.models();
        const {
            params: {
                id
            }
        } = request;

        const product = await Product.query().select().where('sku', id).first();

        return {
            status: 'success',
            description: 'data has been retrieved successfully',
            data: product
        };
    }
};
