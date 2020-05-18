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

  find(id) {
    const query = `
      SELECT recipe_files.*, files.path AS path, files.name AS name
      FROM recipe_files 
      LEFT JOIN files ON (recipe_files.file_id = files.id)
      WHERE recipe_files.recipe_id = $1
      ORDER BY recipe_files.recipe_id
    `;

    return db.query(query, [id]);
  },

  delete(id) {
    return db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [id]);
  },
};