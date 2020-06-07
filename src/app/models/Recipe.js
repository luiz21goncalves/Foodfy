const Base = require('./Base');
const db = require('../../config/db');

Base.init({ table: 'recipes' });

module.exports = {
  ...Base,

  async findAllRecipesChefName() {
    const results = await db.query(`
    SELECT recipes.*, chefs.name AS chef_name
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    ORDER BY recipes.created_at DESC
  `);

    return results.rows;
  },

  async create(fields) {
    const keys = [];
    const values = [];

    Object.keys(fields).map((key) => {
      keys.push(keys);
      if (key === 'ingredients' || key === 'preparation') {
        values.push(`'{${fields[key]}}'`);
      } else {
        values.push(`'${fields[key]}'`);
      }
    });
  },

  update(id, fields) {
    const line = [];

    Object.keys(fields).map((key) => {
      if (key === 'ingredients' || key === 'preparation') {
        line.push(` ${key} = '{${fields[key]}}'`);
      } else {
        line.push(` ${key} = '${fields[key]}'`);
      }
    });

    const query = `UPDATE recipes SET ${line.join(',')} WHERE id = ${id}`;

    return db.query(query);
  },

  findOneRecipeChefName(id) {
    const query = `
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1
    `;

    return db.query(query, [id]);
  },

  async search(filter) {
    const results = await db.query(`
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.title ILIKE '%${filter}%'
      ORDER BY recipes.created_at DESC
    `);

    return results.rows;
  },

  async chefSelectionOptions() {
    const results = await db.query(`SELECT name, id FROM chefs`);

    return results.rows;
  },
};
