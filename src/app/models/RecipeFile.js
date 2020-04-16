const db = require('../../config/db');

module.exports = {
  create(fileId, recipeId) {
    const query = `
      INSERT INTO recipe_files (
        recipe_id,
        file_id
      )
    `;

    const values = [
      fileId,
      recipeId
    ];

    return db.query(query, values);
  }
}