module.exports = async (request, h) => {
    const { Order } = request.server.models();
    const {
        params: {
            id
        }
    } = request;

    const order = await Order.query().select().where('id', id).first();

    if (order) {
        return {
            status: 'success',
            description: 'data has been retrieved successfully',
            data: order
        };
    }

    return {
        status: 'failed',
        description: 'no data found',
    };
}
