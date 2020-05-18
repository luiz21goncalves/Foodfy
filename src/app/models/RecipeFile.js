const db = require('../../config/db');

module.exports = {
  create(fileId, recipeId) {
    const query = `
      INSERT INTO recipe_files (
        recipe_id,
        file_id
      ) VALUES ($1, $2)
      RETURNING id
    `;

    return db.query(query, [recipeId, fileId]);
  },

  delete(id) {
    return db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [id]);
  },
};