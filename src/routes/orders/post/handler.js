module.exports = async (request, h) => {
  const { Order, Product } = request.server.models();
  const { payload } = request;

  const product = await Product.getBySku(payload.sku);
  if (!product) {
    return h.response({
      status: 'canceled',
      description: 'no product with specified SKU found',
    });
  }

  const data = await Order.insertPendingOrder(payload, ['*']);

  return h.response({
    status: 'success',
    description: 'data has been created successfully',
    data,
  });
};
