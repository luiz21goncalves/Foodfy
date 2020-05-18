const db = require('../../config/db');

module.exports = {
  create(fileId, recipeId) {
    const query = `
      INSET INTO recipe_files (
        recipe_id,
        file_id
      ) VALUES ($1, $2)
      RETURNING id
    `;

    return db.query(query, [recipeId, fileId]);
  },
};