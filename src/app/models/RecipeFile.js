const db = require('../../config/db');

module.exports = {
  create( fileId , recipeId) {
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
    try {
      return db.query(`
        SELECT files.*, recipe_files.recipe_id AS recipe_id
        FROM recipe_files
        LEFT JOIN files ON (recipe_files.file_id = files.id)
        GROUP BY files.id, recipe_files.recipe_id
        ORDER BY files.id
      `)
    } catch (err) {
      throw new Error(err);
    }
  },

  find(id) {
    try {
      return db.query(`
        SELECT * 
        FROM recipe_files 
        WHERE recipe_files.recipe_id = $1
        ORDER BY recipe_files.file_id`,
        [id]
      );
    } catch (err) {
      throw new Error(err);
    }
  },

  delete(fileId) {
    try {
      return db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [fileId]);
    } catch (err) {
      throw new Error(err);
    }
  }
}