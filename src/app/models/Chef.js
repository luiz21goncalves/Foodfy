const Base = require('./Base');
const db = require('../../config/db');

Base.init({ table: 'chefs' });

module.exports = {
  ...Base,

  async findAllChefsCountRecipes() {
    const results = await db.query(`
      SELECT chefs.*, COUNT(recipes) As total
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      GROUP BY chefs.id
      ORDER BY chefs.created_at DESC
    `);

    return results.rows;
  },

  async findOneChefCountRecipes(id) {
    const results = await db.query(`
      SELECT chefs.*, COUNT(recipes) As total
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      WHERE chefs.id = ${id}
      GROUP BY chefs.id
    `);

    return results.rows[0];
  },
};
