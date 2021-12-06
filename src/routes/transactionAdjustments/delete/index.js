const Joi = require('joi');

module.exports = {
    method: 'DELETE',
    path: '/transaction-adjustments/{id}',
    options: {
        description: 'Delete a products',
        notes: 'Need to provide product ID/SKU for the endpoint',
        tags: ['api'],
        validate: {
            params: Joi.object({
                id : Joi.string()
                    .description('ID of transaction adjustment'),
            })
        },
    },
    handler: async (request, h) => {
        const { TransactionAdjustment } = request.server.models();
        const { logger } = request.server;
        const {
            params: {
                id
            }
        } = request;

        let data;

        try {
            // fetching target data to be represented in response
            // if deleting process is success
            data = await TransactionAdjustment.query().select().where('id', id).first();

            if(!data) {
                // return failed when no data is exist
                return {
                    status: 'failed',
                    description: 'no data found'
                }
            }

            await TransactionAdjustment.query().delete().where('id', id);
        } catch (err) {
            logger.error(err, 'something went wrong')

            return {
                status: 'failed',
                description: 'something went wrong'
            }
        }

        return {
            status: 'success',
            description: 'data has been deleted successfully',
            data: data
        };
    }
};
