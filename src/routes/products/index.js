const deleteProduct = require('./delete');
const getProduct = require('./get');
const listProduct = require('./list');
const patchProduct = require('./patch');
const postProduct = require('./post');

module.exports = [
  deleteProduct,
  getProduct,
  listProduct,
  patchProduct,
  postProduct,
];
