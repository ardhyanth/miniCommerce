const Joi = require('joi');

module.exports = {
    method: 'GET',
    path: '/products',
    options: {
        description: 'Get product list',
        notes: 'This is the root of the service',
        tags: ['api'],
        validate: {
            query: Joi.object({
                limit : Joi.number()
                    .min(1)
                    .description('Amount of data to query (min: 1)')
                    .example(10),
                page : Joi.number()
                    .min(1)
                    .description('Page number to query (min: 1)')
                    .example(1),
            })
        },
    },
    handler: async (request, h) => {
        const { Product } = request.server.models();
        const { query: {
            limit = 10,
            page = 1
        } } = request;
        const offset = (page - 1) * limit;

        const [{count: total}, data] = await Promise.all([
            Product.query().count().first(),
            Product.query().select().limit(limit).offset(offset)
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
};
