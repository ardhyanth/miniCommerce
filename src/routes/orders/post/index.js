const Joi = require('joi');

const handler = require('./handler');

module.exports = {
  method: 'POST',
  path: '/orders',
  options: {
    description: 'Create an orders',
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
  handler,
};
