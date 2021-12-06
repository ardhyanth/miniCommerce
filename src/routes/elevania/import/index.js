const Joi = require('joi');
const fetch = require('node-fetch');
const convert = require('xml-js');
const config = require('../../../../config');

module.exports = {
    method: 'GET',
    path: '/elevenia/products/import/{sku}',
    options: {
        description: 'Import products details',
        notes: 'This endpoint will query for products details from Elevenia and import the data to database',
        tags: ['api'],
        validate: {
            params: Joi.object({
                sku : Joi.string()
                    .description('SKU to be imported')
                    .example(1)
                    .required()
            })
        },
    },
    handler: async (request, h) => {
        const { logger } = request.server;
        const { Product, TransactionAdjustment } = request.server.models();
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

            const existingProduct = await Product.query().where({ sku: product.prdNo._text }).first();

            if (existingProduct) {
                return {
                    status: 'canceled',
                    description: 'product is already exists in database'
                };
            }

            const productPayload = {
                sku: product.prdNo._text,
                name: product.prdNm._text,
                price: product.selPrc._text,
                description: product.htmlDetail._text,
                image: '-'
            };
            const transactionAdjustmentPayload = {
                sku: product.prdNo._text,
                qty: product.prdSelQty._text
            }

            await Product.query().insert(productPayload);
            // sequential process
            await TransactionAdjustment.query().insert(transactionAdjustmentPayload);

            const insertedProduct = await Product.query().where({ sku: productPayload.sku }).first();

            return {
                status: 'success',
                description: 'successfully retrieve data from Elevenia',
                data: insertedProduct
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
