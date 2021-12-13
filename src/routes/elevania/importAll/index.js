/* eslint-disable no-await-in-loop, no-unreachable-loop */

const { eleveniaConnector } = require('../../../connectors');
const { getProductBySku } = require('../../../connectors/elevenia');

module.exports = {
  method: 'GET',
  path: '/elevenia/products/import/all',
  options: {
    description: 'Import all products from Elevenia',
    notes: 'This endpoint will query for products details from Elevenia and import the data to database',
    tags: ['api'],
  },
  handler: async (request, h) => {
    const { logger } = request.server;
    const { Product, TransactionAdjustment } = request.server.models();

    let page = 1;
    const result = [];

    while (true) {
      try {
        const fetchedProducts = await eleveniaConnector.getProductsByPage(page);

        if (!fetchedProducts) {
          break;
        }

        const insertResult = await Promise.all(
          fetchedProducts.map(async (productToStored) => {
            const { stock, ...newProduct } = productToStored;

            const existingProduct = await Product.getBySku(productToStored.sku);
            if (existingProduct) {
              return {
                ...existingProduct,
                status: 'Already exists',
              };
            }

            const transactionAdjustmentPayload = {
              sku: newProduct.sku,
              qty: stock,
            };

            const { description } = await getProductBySku(productToStored.sku);
            // sequential process
            const insertedProduct = await Product.insertOne({ ...newProduct, description }, ['*']);
            // sequential process
            await TransactionAdjustment.insertOne(transactionAdjustmentPayload);

            return {
              ...insertedProduct,
              status: 'Inserted',
            };
          }),
        );

        result.push(...insertResult);
      } catch (err) {
        logger.error({ err }, 'something went wrong while fetching data to Elevenia');

        result.push({ page, status: 'failed' });
      }

      page += 1;

      // add delay between fetch
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return h.response({
      status: 'success',
      description: 'imports all data is done',
      total: result.length,
      data: result,
    });
  },
};
