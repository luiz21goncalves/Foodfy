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
  }
}