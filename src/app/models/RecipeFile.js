const db = require('../../config/db');

module.exports = {
  create({ fileId }, recipeId) {
    try {
      const query = `
        INSERT INTO recipe_files (
          recipe_id,
          file_id
        ) VALUES ($1,$2)
        RETURNING id`;

      const values = [
        recipeId,
        fileId,
      ];

      return db.query(query, values);
    } catch (err) {
      throw new Error(err);
    }
  },

  all() {
    return db.query(`
      SELECT files.*, recipe_files.recipe_id
      FROM recipe_files
      JOIN files ON (recipe_files.file_id = files.id)
      GROUP BY files.id, recipe_files.recipe_id
      ORDER BY files.id
    `)
  },

  find(id) {
    return db.query(`
      SELECT * 
      FROM recipe_files 
      WHERE recipe_files.recipe_id = $1
      ORDER BY recipe_files.file_id
      `,
      [id]
    );
  }
}