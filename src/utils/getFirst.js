/**
 * get first rows of query result
 *
 * @param {promise<object>} queryObject - knex query promise object
 *
 * @returns {promise<object>} - first object of query result
 */
const getFirst = async (queryPromise) => {
  const result = await queryPromise;

  return result.rows?.[0];
};

module.exports = getFirst;
