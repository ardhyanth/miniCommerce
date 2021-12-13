const Joi = require('joi');

const Schwifty = require('@hapipal/schwifty');

const { getFirst, getAll } = require('../utils');

class Order extends Schwifty.Model {
  static tableName = 'orders';

  static joiSchema = Joi.object({
    id: Joi.number(),
    sku: Joi.string(),
    qty: Joi.number(),
    status: Joi.string(),
  });

  static setLogger(logger) {
    this.logger = logger;
  }

  static async getById(id) {
    let result;

    try {
      result = await getFirst(
        this.knex().raw(
          'SELECT id, sku, qty, status FROM ?? WHERE id = ?',
          [this.tableName, id],
        ),
      );
    } catch (e) {
      this.logger.error(e, 'error while run getById in Order model');
    }

    return result;
  }

  static async list(limit, offset) {
    let result;

    try {
      result = await getAll(
        this.knex().raw(
          'SELECT id, sku, qty, status FROM ?? LIMIT ? OFFSET ?',
          [this.tableName, limit, offset],
        ),
      );
    } catch (e) {
      this.logger.error(e, 'error while run list in Order model');
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
      this.logger.error(e, 'error while run countAll in Order model');
    }

    return result;
  }

  static async updateById(updatePayload, id, returning = ['*']) {
    const fields = Object.keys(updatePayload);
    const values = Object.values(updatePayload);

    const fieldSet = fields.reduce((setString, field) => `${setString + field} = ?,`, '').slice(0, -1);
    const returningSet = returning.join(', ');

    let result;

    try {
      result = await getFirst(
        this.knex().raw(
          `UPDATE ?? SET ${fieldSet} WHERE id = ? RETURNING ${returningSet}`,
          [this.tableName, ...values, id],
        ),
      );
    } catch (e) {
      this.logger.error(e, 'error while run updateById in Order model');
    }

    return result;
  }

  static async insertPendingOrder(insertPayload, returning) {
    Object.assign(insertPayload, { status: 'pending' });

    const fields = Object.keys(insertPayload);
    const values = Object.values(insertPayload);

    // eslint-disable-next-line no-unused-vars
    const valueSet = fields.map((_) => '?').join(', ');
    const fieldSet = fields.join(', ');
    const returningSet = returning.join(', ');

    let result;

    try {
      result = await getFirst(
        this.knex().raw(
          `INSERT INTO ?? (${fieldSet}) VALUES(${valueSet}) RETURNING ${returningSet}`,
          [this.tableName, ...values],
        ),
      );
    } catch (e) {
      this.logger.error(e, 'error while run insertPendingOrder in TransactionAdjustment model');
    }

    return result;
  }
}

module.exports = Order;
