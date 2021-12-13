/**
 * get all rows of query result
 *
 * @param {promise<object>} queryObject - knex query promise object
 *
 * @returns {promise<object>} - all object from query result
 */
const getAll = async (queryPromise) => {
  const result = await queryPromise;

  return result.rows;
};

module.exports = getAll;
