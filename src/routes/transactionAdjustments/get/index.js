const Joi = require('joi');

module.exports = {
    method: 'GET',
    path: '/transaction-adjustments/{id}',
    options: {
        description: 'Get transaction adjustment detail',
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
        const { TransactionAdjustment } = request.server.models();
        const {
            params: {
                id
            }
        } = request;

        const product = await TransactionAdjustment.query().select().where('id', id).first();

        return {
            status: 'success',
            description: 'data has been retrieved successfully',
            data: product
        };
    }
};
