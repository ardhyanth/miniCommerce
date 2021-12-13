const fs = require('fs').promises;
const Joi = require('joi');

module.exports = {
  method: 'DELETE',
  path: '/products/{id}',
  options: {
    description: 'Delete a products',
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
    const { logger } = request.server;
    const {
      params: {
        id,
      },
    } = request;

    let data;

    try {
      // fetching target data to be represented in response
      // if deleting process is success
      data = await Product.getBySku(id);

      if (!data) {
        // return failed when no data is exist
        return {
          status: 'failed',
          description: 'no data found',
        };
      }

      // make sure the local data is deleted first, then delete the in database
      // so, no usage of Promise.all()
      if (data.image !== '-') {
        logger.info(`deleting data of product with sku: ${data.sku}`);

        await fs.unlink(`./${data.image}`);
      }

      await Product.deleteBySku(id);
    } catch (err) {
      logger.error(err, 'something went wrong');

      return h.response({
        status: 'failed',
        description: 'something went wrong',
      });
    }

    return h.response({
      status: 'success',
      description: 'data has been deleted successfully',
      data,
    });
  },
};
