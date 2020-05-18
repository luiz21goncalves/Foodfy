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
      data.user_id || 1,
      data.title,
      data.ingredients,
      data.preparation,
      data.informatiton,
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

    // Object.keys(filters).map(key => {
    //   query = `${query} ${key}`

    //   Object.keys(filters[key]).map(field => {
    //     query = `${query} ${field} = '${filters[key][field]}'`
    //   });
    // });

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

  ChefSelectionOptions() {
    return db.query(`SELECT name, id FROM chefs`);
  }
}