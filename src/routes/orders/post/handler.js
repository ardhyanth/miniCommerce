module.exports = async (request, h) => {
    const { Order, Product } = request.server.models();
    const { payload } = request;

    const product = await Product.query().where({ sku: payload.sku }).first();
    if (!product) {
        return {
            status: 'canceled',
            description: 'no product with specified SKU found'
        };
    }

    const insertResult = await Order.query().insert({ ...payload, status: 'pending'});

    const data = await Order.query().where({ id: insertResult.id }).first();

    return {
        status: 'success',
        description: 'data has been created successfully',
        data
    };
}
