const Joi = require('joi');

module.exports = {
  method: 'POST',
  path: '/transaction-adjustments',
  options: {
    description: 'Create a transaction adjustment',
    notes: 'Please check the payload required for the request',
    tags: ['api'],
    plugins: {
      'hapi-swagger': {
        payloadType: 'form',
      },
    },
    validate: {
      payload: Joi.object({
        sku: Joi.string().required().example('11141234'),
        qty: Joi.number().required().example(50),
      }),
    },
  },
  handler: async (request, h) => {
    const { TransactionAdjustment } = request.server.models();
    const { payload } = request;

    if (payload.amount) {
      return h.response({
        status: 'failed',
        description: 'setting amount value manually is prohibited',
      });
    }

    const data = await TransactionAdjustment.insertOne(payload, ['*']);

    if (!data) {
      return h.response({
        status: 'failed',
        description: 'something when wrong when insert transaction adjustment data',
      });
    }
    return h.response({
      status: 'success',
      description: 'data has been created successfully',
      data,
    });
  },
};
