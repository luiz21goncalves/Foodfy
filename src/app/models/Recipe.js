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
      data.user_id ||1,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
    ];

    return db.query(query, values);
  },

  async update(id, fields) {
    let query = `UPDATE recipes SET`;

    Object.keys(fields).map((key, index, array) => {
      if ((index + 1 < array.length)) {
        if (key == 'ingredients' || key == 'preparation') {
          query = `${query} ${key} = '{${fields[key]}}',`;
        } else {
          query = `${query} ${key} = '${fields[key]}',`;
        }
      } else {
        query = `${query} ${key} = '${fields[key]}'WHERE id = ${id}`;
      }
    });

    await db.query(query);
    
    return 
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