/* eslint-disable no-underscore-dangle */

const Joi = require('joi');
const fetch = require('node-fetch');
const convert = require('xml-js');

const config = require('../../../../config');

module.exports = {
  method: 'GET',
  path: '/elevenia/products',
  options: {
    description: 'Get products list from Elevenia',
    notes: 'This endpoint will query for products list from Elevenia',
    tags: ['api'],
    validate: {
      query: Joi.object({
        page: Joi.number().min(1)
          .description('Page number to look up')
          .example(1)
          .required(),
      }),
    },
  },
  handler: async (request, h) => {
    const { logger } = request.server;
    const {
      query: {
        page,
      },
    } = request;

    try {
      const rawResponse = await fetch(`http://api.elevenia.co.id/rest/prodservices/product/listing?page=${page}`, {
        method: 'get',
        headers: { openapikey: config.openApiKey },
      });

      const xmlResponse = await rawResponse.text();

      const response = convert.xml2json(xmlResponse, { compact: true, spaces: 4 });

      const { Products: { product } } = JSON.parse(response);

      if (!product) {
        return h.response({
          status: 'failed',
          description: 'there is no data in this page',
        });
      }

      const mappedProductList = product.map((data) => ({
        sku: data.prdNo._text,
        name: data.prdNm._text,
        price: data.selPrc._text,
        stock: data.prdSelQty._text,
      }));

      return h.response({
        status: 'success',
        description: 'successfully retrieve data from Elevenia',
        data: mappedProductList,
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
