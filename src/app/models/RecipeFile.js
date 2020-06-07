const db = require('../../config/db');
const Base = require('./Base');

Base.init({ table: 'recipe_files' });

module.exports = {
  ...Base,

  async findRecipeFilesByRecipeId(id) {
    const results = await db.query(`
      SELECT recipe_files.*, files.path AS path, files.name AS name
      FROM recipe_files 
      LEFT JOIN files ON (recipe_files.file_id = files.id)
      WHERE recipe_files.recipe_id = ${id}
      ORDER BY recipe_files.recipe_id
    `);

    return results.rows;
  },
};
