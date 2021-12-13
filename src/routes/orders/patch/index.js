const Joi = require('joi');

const handler = require('./handler');

module.exports = {
  method: 'PATCH',
  path: '/orders',
  options: {
    description: 'Update an orders',
    notes: 'Please check the payload required for the request',
    tags: ['api'],
    plugins: {
      'hapi-swagger': {
        payloadType: 'form',
      },
    },
    validate: {
      payload: Joi.object({
        id: Joi.number().example('11141234').description('product SKU'),
        status: Joi.string().example('accept').valid('accept', 'cancel'),
      }),
    },
  },
  handler,
};
