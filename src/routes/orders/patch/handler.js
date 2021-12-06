module.exports = async (request, h) => {
    const { Order, TransactionAdjustment } = request.server.models();
    const { id, status } = request.payload;

    const existingData = await Order.query().where({ id }).first();

    if (!existingData) {
        // return failed when no data is exist

        return {
            status: 'failed',
            description: 'no data found'
        }
    }

    if (existingData.status !== 'pending') {
        return {
            status: 'failed',
            description: 'order is already on final status'
        }
    }

    if (status === 'accept') {
        await Order.query().update({ status }).where({ id });

        const transactionPayload = {
            sku: existingData.sku,
            qty: -existingData.qty
        }

        await TransactionAdjustment.query().insert(transactionPayload);

        const data = await Order.query().where({ id }).first();

        return {
            status: 'success',
            description: 'data has been created successfully',
            data
        };
    } else if (status === 'cancel') {
        await Order.query().update({ status }).where({ id });

        const data = await Order.query().where({ id }).first();

        return {
            status: 'success',
            description: 'data has been created successfully',
            data
        };
    }
}
