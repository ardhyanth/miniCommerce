const Joi = require('joi');

const handler = require('./handler');

module.exports = {
  method: 'GET',
  path: '/orders',
  options: {
    description: 'Get order list',
    notes: 'This endpoint will get order list with pagination available',
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
  handler,
};
