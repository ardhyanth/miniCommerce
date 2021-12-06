const fs = require('fs').promises;
const Joi = require('joi');

module.exports = {
    method: 'PATCH',
    path: '/products',
    options: {
        description: 'Update a products',
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
                name: Joi.string().example('Vibes Bottle 500ml'),
                image: Joi.any().meta({ swaggerType: 'file' }),
                price: Joi.number().example(1000),
                description: Joi.string().example('You can save some water with this')
            })
        },
    },
    handler: async (request, h) => {
        const { Product } = request.server.models();
        const { payload } = request;
        const { image } = payload;

        if(payload.stock) {
            return {
                status: 'failed',
                description: 'setting stock value manually is prohibited, ' +
                    'try to add the stock by transaction adjustment'
            }
        }

        const existingData = await Product.query().where({ sku: payload.sku }).first();

        if(!existingData){
            // return failed when no data is exist

            return {
                status: 'failed',
                description: 'no data found'
            }
        }

        let insertPayload = payload;

        if (image) {
            const {
                hapi: {
                    filename
                },
                _data: fileData
            } = image;
            const imagePath = 'upload/' + filename;
            insertPayload = {
                ...insertPayload,
                image: imagePath
            }

            await fs.writeFile('./' + imagePath, fileData);
        }

        await Product.query().update(insertPayload);

        // No Promise.all() here, only check the latest data
        // after insertion process
        const data = await Product.query().where(insertPayload).first();

        if (image) {
            // delete old file only after everything is OK
            await fs.unlink('./' + existingData.image);
        }

        return {
            status: 'success',
            description: 'data has been created successfully',
            data
        };
    }
};
