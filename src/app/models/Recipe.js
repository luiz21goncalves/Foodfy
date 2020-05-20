const db = require('../../config/db');

module.exports = {
  all() {
    const query = `
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ORDER BY recipes.created_at DESC
    `;

    return db.query(query);
  },

  create(data) {
    const query = `
      INSERT INTO recipes (
        chef_id,
        user_id,
        title,
        ingredients,
        preparation,
        information
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const values = [
      data.chef_id,
<<<<<<< HEAD
      data.user_id ||1,
=======
      data.user_id || 1,
>>>>>>> refactoring
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
    ];

    return db.query(query, values);
  },

  update(data) {
    const query = `
      UPDATE recipes SET
        chef_id=($1),
        user_id=($2),
        title=($3),
        ingredients=($4),
        preparation=($5),
        information=($6)
      WHERE id = $7
    `;

    const values = [
      data.chef_id,
      data.user_id || 1,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.id,
    ];

    return db.query(query, values);
  },

  findOne(id) {
    let query = `
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1
    `;

    return db.query(query, [id]);
  },

  search(filter) {
    return db.query(`
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.title ILIKE '%${filter}%'
      ORDER BY recipes.created_at DESC
    `);
  },

  delete(id) {
    return db.query(`DELETE FROM recipes WHERE id = $1`, [id]);
  },

  ChefSelectionOptions() {
    return db.query(`SELECT name, id FROM chefs`);
  }
}