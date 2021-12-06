const fs = require('fs').promises;
const Joi = require('joi');

module.exports = {
    method: 'POST',
    path: '/products',
    options: {
        description: 'Create a products',
        notes: 'Need to provide product ID/SKU for the endpoint',
        tags: ['api', 'fileUpload', 'POST'],
        plugins: {
            'hapi-swagger': {
                payloadType: 'form'
            }
        },
        payload: {
            maxBytes: 10 * 1024 * 1024,
            parse: true,
            output: 'stream',
            allow: 'multipart/form-data',
            multipart: true
        },
        validate: {
            payload: Joi.object({
                sku: Joi.string().required().example('11141234'),
                name: Joi.string().required().example('Vibes Bottle 500ml'),
                image: Joi.any().meta({ swaggerType: 'file' }).required(),
                price: Joi.number().required().example(1000),
                description: Joi.string().example('You can save some water with this')
            })
        },
    },
    handler: async (request, h) => {
        const { Product } = request.server.models();
        const { payload } = request;
        const {
            hapi: {
                filename
            },
            _data: fileData
        } = payload.image;

        if(payload.stock) {
            return {
                status: 'failed',
                description: 'setting stock value manually is prohibited, ' +
                    'try to add the stock by transaction adjustment'
            }
        }

        const imagePath = 'upload/' + filename;
        const insertPayload = {
            ...payload,
            image: imagePath
        }

        await fs.writeFile('./' + imagePath, fileData);

        // No Promise.all() here, we dont want to insert any data if
        // there is something went wrong in the file writing process

        await Product.query().insert(insertPayload);

        // No Promise.all() here, only check the latest data
        // after insertion process

        const data = await Product.query().where(insertPayload).first();

        return {
            status: 'success',
            description: 'data has been created successfully',
            data
        };
    }
};
