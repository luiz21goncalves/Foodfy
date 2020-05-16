const db = require('../../config/db');

module.exports = {
  all() {
    return db.query(`
      SELECT chefs.*, COUNT(recipes) As total
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      GROUP BY chefs.id
      ORDER BY chefs.created_at DESC
    `);
  },

  findOne(id) {
    return db.query(`
      SELECT chefs.*, COUNT(recipes) As total
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      WHERE chefs.id = $1
      GROUP BY chefs.id`,
      [id]
    );
  },

  findRecipeByChef(id) {
    return db.query(`
      SELECT recipes.*
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      WHERE recipes.chef_id = $1
      ORDER BY recipes.created_at DESC`,
      [id]
    );
  }
}