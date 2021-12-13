module.exports = async (request, h) => {
  const { Order } = request.server.models();
  const {
    params: {
      id,
    },
  } = request;

  const data = await Order.getById(id);

  if (data) {
    return h.response({
      status: 'success',
      description: 'data has been retrieved successfully',
      data,
    });
  }

  return h.response({
    status: 'failed',
    description: 'no data found',
  });
};
