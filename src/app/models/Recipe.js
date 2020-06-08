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
    try {
      const keys = [];
      const values = [];

      Object.keys(fields).map((key) => {
        keys.push(key);
        if (key === 'ingredients' || key === 'preparation') {
          values.push(`'{${fields[key]}}'`);
        } else {
          values.push(`'${fields[key]}'`);
        }
      });

      const query = `INSERT INTO ${this.table} 
        (${keys.join(',')}) 
        VALUES (${values.join(',')}) 
        RETURNING id`;

      const results = await db.query(query);

      return results.rows[0].id;
    } catch (err) {
      console.error(err);
    }
  },

  update(id, fields) {
    try {
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
    } catch (err) {
      console.error(err);
    }
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
