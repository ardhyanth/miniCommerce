const Joi = require('joi');

module.exports = {
    method: 'POST',
    path: '/transaction-adjustments',
    options: {
        description: 'Create a transaction adjustment',
        notes: 'Need to provide product ID/SKU for the endpoint',
        tags: ['api'],
        plugins: {
            'hapi-swagger': {
                payloadType: 'form'
            }
        },
        validate: {
            payload: Joi.object({
                sku: Joi.string().required().example('11141234'),
                qty: Joi.number().required().example(50)
            })
        },
    },
    handler: async (request, h) => {
        const { TransactionAdjustment } = request.server.models();
        const { payload } = request;

        if(payload.amount) {
            return {
                status: 'failed',
                description: 'setting amount value manually is prohibited'
            }
        }

        const insertResult = await TransactionAdjustment.query().insert(payload);
        // No Promise.all() here, only check the latest data
        // after insertion process

        const data = await TransactionAdjustment.query().where({ id: insertResult.id }).first();

        return {
            status: 'success',
            description: 'data has been created successfully',
            data
        };
    }
};
