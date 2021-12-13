const Joi = require('joi');

const { getProductBySku } = require('../../../connectors/elevenia');

module.exports = {
  method: 'GET',
  path: '/elevenia/products/{sku}',
  options: {
    description: 'Get products details from Elevenia',
    notes: 'This endpoint will query for products details from Elevenia',
    tags: ['api'],
    validate: {
      params: Joi.object({
        sku: Joi.string()
          .description('SKU to look up')
          .example(1)
          .required(),
      }),
    },
  },
  handler: async (request, h) => {
    const { logger } = request.server;
    const {
      params: {
        sku,
      },
    } = request;

    try {
      const data = await getProductBySku(sku);

      return h.response({
        status: 'success',
        description: 'successfully retrieve data from Elevenia',
        data,
      });
    } catch (err) {
      logger.error({ err }, 'something went wrong while fetching data to Elevenia');

      return h.response({
        status: 'failed',
        description: 'something went wrong while fetching data to Elevenia',
      });
    }
  },
};
