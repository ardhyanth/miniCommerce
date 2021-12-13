const fs = require('fs').promises;
const Joi = require('joi');

module.exports = {
  method: 'PATCH',
  path: '/products',
  options: {
    description: 'Update a products',
    notes: 'Please check the payload required for the request',
    tags: ['api', 'fileUpload', 'POST'],
    plugins: {
      'hapi-swagger': {
        payloadType: 'form',
      },
    },
    payload: {
      maxBytes: 10 * 1024 * 1024,
      parse: true,
      output: 'stream',
      allow: 'multipart/form-data',
      multipart: true,
    },
    validate: {
      payload: Joi.object({
        sku: Joi.string().required().example('11141234'),
        name: Joi.string().example('Vibes Bottle 500ml'),
        image: Joi.any().meta({ swaggerType: 'file' }),
        price: Joi.number().example(1000),
        description: Joi.string().example('You can save some water with this'),
      }),
    },
  },
  handler: async (request, h) => {
    const { Product } = request.server.models();
    const { payload } = request;
    const { image } = payload;

    if (payload.stock) {
      return h.response({
        status: 'failed',
        description: 'setting stock value manually is prohibited, '
            + 'try to add the stock by transaction adjustment',
      });
    }

    const existingData = await Product.getBySku(payload.sku);

    if (!existingData) {
    // return failed when no data is exist

      return h.response({
        status: 'failed',
        description: 'no data found',
      });
    }

    const { sku, ...updatePayload } = payload;

    if (image) {
      const {
        hapi: {
          filename,
        },
        _data: fileData,
      } = image;
      const imagePath = `upload/${filename}`;
      Object.assign(updatePayload, { image: imagePath });

      await fs.writeFile(`./${imagePath}`, fileData);
    }

    const data = await Product.updateBySku(updatePayload, sku, ['*']);

    if (image && existingData.image !== '-') {
    // delete old file only after everything is OK
      await fs.unlink(`./${existingData.image}`);
    }

    return h.response({
      status: 'success',
      description: 'data has been updated successfully',
      data,
    });
  },
};
