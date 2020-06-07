const db = require('../../config/db');

function find(filters, table) {
  let query = `SELECT * FROM ${table}`;

  if (filters) {
    Object.keys(filters).map((key) => {
      query += ` ${key}`;

      Object.keys(key).map((field) => {
        query += ` ${field} = ${filters[key][field]}`;
      });
    });
  }

  return db.query(query);
}

const Base = {
  init({ table }) {
    if (!table) throw new Error('Invalid params');

    this.table = table;

    return this;
  },

  async find(id) {
    const results = await find({ where: { id } }, this.table);

    return results.rows;
  },

  async findOne(filteres) {
    const results = await find(filteres, this.table);

    return results.rows;
  },

  async findAll(filteres) {
    const results = await find(filteres, this.table);

    return results.rows;
  },

  async create(fields) {
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
  },

  update(id, fields) {
    const line = [];

    Object.keys(fields).map((key) => {
      line.push(`${key} = ${fields[key]}`);
    });

    const query = `UPDATE ${this.table} SET
      ${line.join(',')}
      WHERE id = ${id}`;

    return db.query(query);
  },

  delete(id) {
    return db.query(`DELETE FROM ${this.table} WHERE id = ${id}`);
  },

  count() {
    return db.query(`COUNT * FROM ${this.table}`);
  },
};

module.exports = Base;
