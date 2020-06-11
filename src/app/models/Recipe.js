const Base = require('./Base');
const db = require('../../config/db');

Base.init({ table: 'recipes' });

module.exports = {
  ...Base,

  async create(fields) {
    try {
      const keys = [];
      const values = [];

      Object.keys(fields).map((key) => {
        keys.push(key);
        if (key == 'ingredients' || key == 'preparation') {
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
        if (key == 'ingredients' || key == 'preparation') {
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

  async chefSelectionOptions() {
    const results = await db.query(`SELECT name, id FROM chefs`);

    return results.rows;
  },

  async search({ filter, limit, offset }) {
    let query = `SELECT * FROM recipes`;

    if (filter) query += ` WHERE recipes.title ILIKE '%${filter}%'`;

    query += `       
      ORDER BY updated_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const results = await db.query(query);

    return results.rows;
  },

  async countSearch(filter) {
    const query = `
      SELECT COUNT(*) FROM recipes
      WHERE recipes.title ILIKE '%${filter}%'
    `;

    const results = await db.query(query);

    return results.rows[0].count;
  },
};
