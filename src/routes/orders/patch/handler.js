module.exports = async (request, h) => {
  const { Order, TransactionAdjustment } = request.server.models();
  const { id, status } = request.payload;

  const existingData = await Order.getById(id);

  if (!existingData) {
    // return failed when no data is exist

    return h.response({
      status: 'failed',
      description: 'no data found',
    });
  }

  if (existingData.status !== 'pending') {
    return h.response({
      status: 'failed',
      description: 'order is already on final status',
    });
  }

  if (status === 'accept') {
    const updatedData = await Order.updateById({ status }, id, ['*']);

    const transactionPayload = {
      sku: existingData.sku,
      qty: -existingData.qty,
    };

    await TransactionAdjustment.insertOne(transactionPayload);

    return h.response({
      status: 'success',
      description: 'data has been created successfully',
      data: updatedData,
    });
  }

  if (status === 'cancel') {
    const updatedData = await Order.updateById({ status }, id, ['*']);

    return h.response({
      status: 'success',
      description: 'data has been created successfully',
      data: updatedData,
    });
  }

  return h.response({
    status: 'failed',
    description: 'invalid "status" payload value',
  });
};
