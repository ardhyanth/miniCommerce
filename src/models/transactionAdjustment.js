const Joi = require('joi');

const Schwifty = require('@hapipal/schwifty');
const { getFirst, getAll } = require('../utils');

class TransactionAdjustment extends Schwifty.Model {
  static tableName = 'transaction_adjustments';

  static joiSchema = Joi.object({
    sku: Joi.string().required(),
    qty: Joi.number().required(),
    amount: Joi.number(),
  });

  static setLogger(logger) {
    this.logger = logger;
  }

  static async getById(id) {
    let result;

    try {
      result = await getFirst(
        this.knex().raw(
          'SELECT id, sku, qty, amount FROM ?? WHERE id = ?',
          [this.tableName, id],
        ),
      );
    } catch (e) {
      this.logger.error(e, 'error while run getById in TransactionAdjustment model');
    }

    return result;
  }

  static async deleteById(id) {
    let result;

    try {
      result = await getFirst(
        this.knex().raw(
          'DELETE FROM ?? WHERE id = ?',
          [this.tableName, id],
        ),
      );
    } catch (e) {
      this.logger.error(e, 'error while run deleteById in TransactionAdjustment model');
    }

    return result;
  }

  static async list(limit, offset) {
    let result;

    try {
      result = await getAll(
        this.knex().raw(
          'SELECT id, sku, qty, amount FROM ?? LIMIT ? OFFSET ?',
          [this.tableName, limit, offset],
        ),
      );
    } catch (e) {
      this.logger.error(e, 'error while run list in TransactionAdjustment model');
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
      this.logger.error(e, 'error while run countAll in TransactionAdjustment model');
    }

    return result;
  }

  static async updateById(updatePayload, id, returning = ['id']) {
    const fields = Object.keys(updatePayload);
    const values = Object.values(updatePayload);

    const fieldSet = `${fields.join(' = ?, ')} = ?`;
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
      this.logger.error(e, 'error while run updateById in TransactionAdjustment model');
    }

    return result;
  }

  static async insertOne(insertPayload, returning = ['id']) {
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
      this.logger.error(e, 'error while run insertOne in TransactionAdjustment model');
    }

    return result;
  }
}

module.exports = TransactionAdjustment;
