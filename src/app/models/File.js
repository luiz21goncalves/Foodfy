const Base = require('./Base');
const db = require('../../config/db');

Base.init({ table: 'files' });

module.exports = {
  ...Base,

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
};
/**
 * async delete(id) {
  try {
    const results = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
    const file = results.rows[0];

    fs.unlinkSync(file.path);

    return db.query(`DELETE FROM files WHERE id = $1`, [id]);
  } catch (err) {
    console.error('File delete', err);
  }
},

*/
