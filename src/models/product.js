const Joi = require('joi');

const Schwifty = require('@hapipal/schwifty');
const { getFirst, getAll } = require('../utils');

class Product extends Schwifty.Model {
  static tableName = 'products';

  static joiSchema = Joi.object({
    sku: Joi.string(),
    name: Joi.string(),
    image: Joi.string(),
    price: Joi.number(),
    description: Joi.string(),
    stock: Joi.number(),
  });

  static idColumn = 'sku';

  static setLogger(logger) {
    this.logger = logger;
  }

  static async getBySku(sku) {
    let result;

    try {
      result = await getFirst(
        this.knex().raw(
          'SELECT sku, name, price, image, stock, description FROM ?? WHERE sku = ?',
          [this.tableName, sku],
        ),
      );
    } catch (e) {
      this.logger.error(e, 'error while run getById in Product model');
    }

    return result;
  }

  static async deleteBySku(sku) {
    let result;

    try {
      result = await getFirst(
        this.knex().raw(
          'DELETE FROM ?? WHERE sku = ?',
          [this.tableName, sku],
        ),
      );
    } catch (e) {
      this.logger.error(e, 'error while run deleteById in Product model');
    }

    return result;
  }

  static async list(limit, offset) {
    let result;

    try {
      result = await getAll(
        this.knex().raw(
          'SELECT sku, name, price, image, stock, description FROM ?? LIMIT ? OFFSET ?',
          [this.tableName, limit, offset],
        ),
      );
    } catch (e) {
      this.logger.error(e, 'error while run list in Product model');
    }

    return result;
  }

  static async countAll() {
    let result;

    try {
      result = await getFirst(
        this.knex().raw(
          'SELECT COUNT(*) FROM ??',
          [this.tableName],
        ),
      );
    } catch (e) {
      this.logger.error(e, 'error while run countAll in Product model');
    }

    return result;
  }

  static async updateBySku(updatePayload, sku, returning = ['id']) {
    const fields = Object.keys(updatePayload);
    const values = Object.values(updatePayload);

    const fieldSet = fields.reduce((setString, field) => `${setString + field} = ?,`, '').slice(0, -1);
    const returningSet = returning.join(', ');

    let result;

    try {
      result = await getFirst(
        this.knex().raw(
          `UPDATE ?? SET ${fieldSet} WHERE sku = ? RETURNING ${returningSet}`,
          [this.tableName, ...values, sku],
        ),
      );
    } catch (e) {
      this.logger.error(e, 'error while run updateById in Product model');
    }

    return result;
  }

  static async insertOne(insertPayload, returning = ['id']) {
    const fields = Object.keys(insertPayload);
    const values = Object.values(insertPayload);

    // eslint-disable-next-line no-unused-vars
    const valueSet = fields.map((_) => '?').join(', ');
    const fieldSet = fields.join(', ');
    const returningSet = returning.join(',');

    let result;

    try {
      result = await getFirst(
        this.knex().raw(
          `INSERT INTO ?? (${fieldSet}) VALUES(${valueSet}) RETURNING ${returningSet}`,
          [this.tableName, ...values],
        ),
      );
    } catch (e) {
      this.logger.error(e, 'error while run insertOne in Product model');
    }

    return result;
  }
}

module.exports = Product;
