const db = require('../../config/db');

function find(filters, table) {
  let query = `SELECT * FROM ${table}`;

  if (filters) {
    Object.keys(filters).map((key) => {
      query += ` ${key}`;

      Object.keys(filters[key]).map((field) => {
        query += ` ${field} = '${filters[key][field]}'`;
      });
    });
  }

  if (table == 'users' || table == 'recipes' || table == 'chefs')
    query += ` ORDER BY created_at DESC`;

  return db.query(query);
}

const Base = {
  init({ table }) {
    if (!table) throw new Error('Invalid params');

    this.table = table;

    return this;
  },

  async find(id) {
    try {
      const results = await find({ where: { id } }, this.table);

      return results.rows[0];
    } catch (err) {
      console.error(err);
    }
  },

  async findOne(filters) {
    try {
      const results = await find(filters, this.table);

      return results.rows[0];
    } catch (err) {
      console.error(err);
    }
  },

  async findAll(filters) {
    try {
      const results = await find(filters, this.table);

      return results.rows;
    } catch (err) {
      console.error(err);
    }
  },

  async create(fields) {
    try {
      const keys = [];
      const values = [];

      Object.keys(fields).map((key) => {
        keys.push(key);
        values.push(`'${fields[key]}'`);
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
        line.push(`${key} = '${fields[key]}'`);
      });

      const query = `UPDATE ${this.table} SET
        ${line.join(',')}
        WHERE id = ${id}`;

      return db.query(query);
    } catch (err) {
      console.error(err);
    }
  },

  delete(id) {
    return db.query(`DELETE FROM ${this.table} WHERE id = ${id}`);
  },

  async count(filters) {
    let query = `SELECT COUNT (*) FROM ${this.table}`;

    if (filters) {
      Object.keys(filters).map((key) => {
        query += ` ${key}`;

        Object.keys(filters[key]).map((field) => {
          query += ` ${field} = '${filters[key][field]}'`;
        });
      });
    }

    const results = await db.query(query);

    return results.rows[0].count;
  },

  async paginate({ filters, limit, offset }) {
    let filterquery = ``;

    if (filters) {
      Object.keys(filters).map((key) => {
        filterquery += ` ${key}`;

        Object.keys(filters[key]).map((field) => {
          filterquery += ` ${field} = '${filters[key][field]}'`;
        });
      });
    }

    const query = `
      SELECT * FROM ${this.table}
      ${filterquery}
      ORDER BY created_at
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const results = await db.query(query);

    return results.rows;
  },
};

module.exports = Base;
