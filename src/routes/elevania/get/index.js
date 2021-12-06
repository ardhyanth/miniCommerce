const Joi = require('joi');
const fetch = require('node-fetch');
const convert = require('xml-js');
const config = require('../../../config');

module.exports = {
    method: 'GET',
    path: '/elevenia/products/{sku}',
    options: {
        description: 'Get products details',
        notes: 'This endpoint will query for products details from elevenia',
        tags: ['api'],
        validate: {
            params: Joi.object({
                sku : Joi.string()
                    .description('SKU to look up')
                    .example(1)
                    .required()
            })
        },
    },
    handler: async (request, h) => {
        const { logger } = request.server;
        const {
            params: {
                sku
            }
        } = request;

        try {
            const rawResponse = await fetch('http://api.elevenia.co.id/rest/prodservices/product/details/' + sku, {
                method: 'get',
                headers: { openapikey: config.openApiKey }
            });

            const xmlResponse = await rawResponse.text();

            const response = convert.xml2json(xmlResponse, {compact: true, spaces: 4});

            const { Product: product } = JSON.parse(response);

            const mappedProduct = {
                sku: product.prdNo._text,
                name: product.prdNm._text,
                price: product.selPrc._text,
                description: product.htmlDetail._text,
                stock: product.prdSelQty._text
            };

            return {
                status: 'success',
                description: 'successfully retrieve data from elevenia',
                data: mappedProduct
            };
        } catch (err) {
            logger.error({ err }, 'something went wrong while fetching data to Elevenia')

            return {
                status: 'failed',
                description: 'something went wrong while fetching data to Elevenia'
            };
        }
    }
};
