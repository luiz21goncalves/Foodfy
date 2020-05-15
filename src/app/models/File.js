const db = require('../../config/db');

module.exports = {
  findByRecipe(recipeId) {
    const query = `
      SELECT files.*, recipe_files.recipe_id AS recipe_id
      FROM files
      LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
      WHERE recipe_files.recipe_id = $1
      ORDER BY files.id
    `;

    return db.query(query, [recipeId]);
  },

  findOne(id) {
    return db.query(`SELECT * FROM files WHERE id = $1`, [id]);
  },
};