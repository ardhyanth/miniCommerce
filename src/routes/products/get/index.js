const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/products/{id}',
  options: {
    description: 'Get product detail',
    notes: 'Need to provide product ID/SKU for the endpoint',
    tags: ['api'],
    validate: {
      params: Joi.object({
        id: Joi.string()
          .description('Product ID or SKU'),
      }),
    },
  },
  handler: async (request, h) => {
    const { Product } = request.server.models();
    const {
      params: {
        id,
      },
    } = request;

    const data = await Product.getBySku(id);

    if (data) {
      return h.response({
        status: 'success',
        description: 'data has been retrieved successfully',
        data,
      });
    }

    return h.response({
      status: 'failed',
      description: 'no data found',
    });
  },
};
