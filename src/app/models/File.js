const Base = require('./Base');
const db = require('../../config/db');

Base.init({ table: 'files' });

module.exports = {
  ...Base,

  async findByRecipeId(recipeId) {
    const results = await db.query(`
      SELECT files.*, recipe_files.recipe_id AS recipe_id
      FROM files
      LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
      WHERE recipe_files.recipe_id = ${recipeId}
      ORDER BY files.id
    `);

    return results.rows;
  },
};
