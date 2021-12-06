const Joi = require('joi');

module.exports = {
    method: 'PATCH',
    path: '/transaction-adjustments',
    options: {
        description: 'Update a products',
        notes: 'Need to provide product ID/SKU for the endpoint',
        tags: ['api'],
        plugins: {
            'hapi-swagger': {
                payloadType: 'form'
            }
        },
        validate: {
            payload: Joi.object({
                id: Joi.number().example('11141234'),
                sku: Joi.string().example('11141234'),
                qty: Joi.string().example('Vibes Bottle 500ml')
            })
        },
    },
    handler: async (request, h) => {
        const { TransactionAdjustment } = request.server.models();
        const { payload } = request;

        if (payload.amount) {
            return {
                status: 'failed',
                description: 'setting amount value manually is prohibited'
            }
        }

        const existingData = await TransactionAdjustment.query().where({ id: payload.id }).first();

        if (!existingData) {
            // return failed when no data is exist

            return {
                status: 'failed',
                description: 'no data found'
            }
        }

        const updatePayload = { ...payload };
        delete updatePayload.id;

        await TransactionAdjustment.query().update(updatePayload).where({ id: payload.id });

        // No Promise.all() here, only check the latest data
        // after insertion process
        const data = await TransactionAdjustment.query().where({ id: payload.id }).first();

        return {
            status: 'success',
            description: 'data has been created successfully',
            data
        };
    }
};
