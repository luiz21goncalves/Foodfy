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
  }
}