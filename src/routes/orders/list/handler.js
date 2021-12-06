module.exports = async (request, h) => {
    const { Order } = request.server.models();
    const {
        limit = 10,
        page = 1
    } = request.query;
    const offset = (page - 1) * limit;

    const [{count: total}, data] = await Promise.all([
        Order.query().count().first(),
        Order.query().select().limit(limit).offset(offset)
    ]);

    return {
        pageInfo: {
            currentPage: page,
            lastPage: Math.ceil(total / limit)
        },
        dataInfo: {
            from: offset,
            to: offset + data.length,
            total: Number(total),
        },
        data
    };
}
