const fs = require('fs');
const db = require('../../config/db');

module.exports = {
  create(data) {
    const query = `
      INSERT INTO files (
        name,
        path
      ) VALUES ($1, $2)
      RETURNING id
    `;

    return db.query(query, [data.filename, data.path]);
  },

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

  async delete(id) {
    try {
      const results = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
      const file = results.rows[0];

      fs.unlinkSync(file.path);

      return db.query(`DELETE FROM files WHERE id = $1`, [id]);
    } catch (err) {
      console.error('File delete', err);
    }
  },
};
