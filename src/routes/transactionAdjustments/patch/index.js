const Joi = require('joi');

module.exports = {
  method: 'PATCH',
  path: '/transaction-adjustments',
  options: {
    description: 'Update a transaction adjustment',
    notes: 'Please check the payload required for the request',
    tags: ['api'],
    plugins: {
      'hapi-swagger': {
        payloadType: 'form',
      },
    },
    validate: {
      payload: Joi.object({
        id: Joi.number().example('11141234'),
        sku: Joi.string().example('11141234'),
        qty: Joi.string().example('Vibes Bottle 500ml'),
      }),
    },
  },
  handler: async (request, h) => {
    const { TransactionAdjustment, Product } = request.server.models();
    const { payload } = request;

    if (payload.amount) {
      return {
        status: 'failed',
        description: 'setting amount value manually is prohibited',
      };
    }

    const existingData = await TransactionAdjustment.getById(payload.id);
    if (!existingData) {
      // return failed when no data is exist

      return h.response({
        status: 'failed',
        description: 'no data found',
      });
    }

    if (payload.sku) {
      const newProductSku = await Product.getBySku(payload.sku);
      if (!newProductSku) {
        // return failed when no data is exist

        return h.response({
          status: 'failed',
          description: 'new product sku is not exists',
        });
      }
    }

    const { id, ...updatePayload } = payload;

    const data = await TransactionAdjustment.updateById(updatePayload, id, ['*']);

    if (!data) {
      return h.response({
        status: 'failed',
        description: 'something went wrong while updating transaction adjustment data',
      });
    }

    return h.response({
      status: 'success',
      description: 'data has been created successfully',
      data,
    });
  },
};
