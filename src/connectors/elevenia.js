/* eslint-disable
no-underscore-dangle, no-await-in-loop,
no-promise-executor-return, no-loop-func */

const fetch = require('node-fetch');
const convert = require('xml-js');
const config = require('../../config');

const getProductsByPage = async (page) => {
  let retry = 5;
  let delay = 100;

  while (retry > 0) {
    try {
      await new Promise((resolve) => setTimeout(resolve, delay));

      const rawResponse = await fetch(`http://api.elevenia.co.id/rest/prodservices/product/listing?page=${page}`, {
        method: 'get',
        headers: { openapikey: config.openApiKey },
      });

      const xmlResponse = await rawResponse.text();

      const response = convert.xml2json(xmlResponse, { compact: true, spaces: 4 });
      const { Products: { product } } = JSON.parse(response);

      if (product) {
        return product.map((data) => ({
          sku: data.prdNo._text,
          name: data.prdNm._text,
          price: data.selPrc._text,
          stock: data.prdSelQty._text,
          image: '-',
        }));
      }

      return null;
    } catch (e) {
      console.error(`error while fetching product list of page ${page} from Elevenia, try to add more delay`);

      retry -= 1;
      delay += 100;
    }
  }

  return null;
};

const getProductBySku = async (sku) => {
  let retry = 5;
  let delay = 100;

  while (retry > 0) {
    try {
      await new Promise((resolve) => setTimeout(resolve, delay));

      const rawResponse = await fetch(`http://api.elevenia.co.id/rest/prodservices/product/details/${sku}`, {
        method: 'get',
        headers: { openapikey: config.openApiKey },
      });

      const xmlResponse = await rawResponse.text();

      const response = convert.xml2json(xmlResponse, { compact: true, spaces: 4 });
      const { Product: product } = JSON.parse(response);

      return {
        sku: product.prdNo._text,
        name: product.prdNm._text,
        price: product.selPrc._text,
        description: product.htmlDetail._text,
        stock: product.prdSelQty._text,
      };
    } catch (e) {
      console.error(`error while fetching product details of sku ${sku} from Elevenia, try to add more delay`);

      retry -= 1;
      delay += 100;
    }
  }

  return null;
};

module.exports = {
  getProductsByPage,
  getProductBySku,
};
