/* eslint-disable no-underscore-dangle */

const Joi = require('joi');

const { getProductBySku } = require('../../../connectors/elevenia');

module.exports = {
  method: 'GET',
  path: '/elevenia/products/import/{sku}',
  options: {
    description: 'Import a product from Elevenia',
    notes: 'This endpoint will query for products details from Elevenia and import the data to database',
    tags: ['api'],
    validate: {
      params: Joi.object({
        sku: Joi.string()
          .description('SKU to be imported')
          .example(1)
          .required(),
      }),
    },
  },
  handler: async (request, h) => {
    const { logger } = request.server;
    const { Product, TransactionAdjustment } = request.server.models();
    const {
      params: {
        sku,
      },
    } = request;

    try {
      const product = await getProductBySku(sku);
      if (!product) {
        return h.response({
          status: 'failed',
          description: 'product with specified SKU is not exists',
        });
      }

      const existingProduct = await Product.getBySku(sku);

      if (existingProduct) {
        return h.response({
          status: 'canceled',
          description: 'product is already exists in database',
        });
      }

      const { stock, ...productPayload } = product;
      const insertedProduct = await Product.insertOne(productPayload, ['*']);

      const transactionAdjustmentPayload = {
        sku: productPayload.sku,
        qty: stock,
      };
      await TransactionAdjustment.insertOne(transactionAdjustmentPayload);

      return h.response({
        status: 'success',
        description: 'successfully to store data from Elevenia',
        data: insertedProduct,
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
