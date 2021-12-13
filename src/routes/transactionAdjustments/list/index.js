const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/transaction-adjustments',
  options: {
    description: 'Get transaction adjustment list',
    notes: 'Please check the payload required for the request',
    tags: ['api'],
    validate: {
      query: Joi.object({
        limit: Joi.number()
          .min(1)
          .description('Amount of data to query (min: 1)')
          .example(10),
        page: Joi.number()
          .min(1)
          .description('Page number to query (min: 1)')
          .example(1),
      }),
    },
  },
  handler: async (request, h) => {
    const { TransactionAdjustment } = request.server.models();
    const {
      query: {
        limit = 10,
        page = 1,
      },
    } = request;
    const offset = (page - 1) * limit;

    const [{ count: total }, data] = await Promise.all([
      TransactionAdjustment.countAll(),
      TransactionAdjustment.list(limit, offset),
    ]);

    return h.response({
      pageInfo: {
        currentPage: page,
        lastPage: Math.ceil(total / limit),
      },
      dataInfo: {
        from: offset,
        to: offset + data.length,
        total: Number(total),
      },
      data,
    });
  },
};
