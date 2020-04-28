const db = require('../../config/db');

module.exports = {
  create( fileId , recipeId) {
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
  },

  all() {
    return db.query(`
      SELECT files.*, recipe_files.recipe_id AS recipe_id
      FROM recipe_files
      LEFT JOIN files ON (recipe_files.file_id = files.id)
      GROUP BY files.id, recipe_files.recipe_id
      ORDER BY files.id
    `)
  },

  find(id) {
    return db.query(`
      SELECT recipe_files.*, files.path AS path, files.name AS name
      FROM recipe_files 
      LEFT JOIN files ON (recipe_files.file_id = files.id)
      WHERE recipe_files.recipe_id = $1
      ORDER BY recipe_files.recipe_id`,
      [id]
    );
  },

  findByFileId(id) {
    return db.query(`
      SELECT * 
      FROM recipe_files 
      WHERE recipe_files.file_id = $1
      ORDER BY recipe_files.file_id`,
      [id]
    );
  },

  delete(id) {
    return db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [id]);
  }
}