const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/transaction-adjustments/{id}',
  options: {
    description: 'Get transaction adjustment detail',
    notes: 'Need to provide transaction adjustment ID for the endpoint',
    tags: ['api'],
    validate: {
      params: Joi.object({
        id: Joi.number()
          .required()
          .description('Transaction adjustment ID'),
      }),
    },
  },
  handler: async (request, h) => {
    const { TransactionAdjustment } = request.server.models();
    const {
      params: {
        id,
      },
    } = request;

    const data = await TransactionAdjustment.getById(id);

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
