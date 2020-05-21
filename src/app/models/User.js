const db = require('../../config/db');

module.exports = {
  async all() {
    const results = await db.query(`SELECT * FROM users ORDER BY created_at DESC`);

    return results.rows;
  },

  async findOne(filters) {
    let query = `SELECT * FROM users`;

    Object.keys(filters).map(key => {
      query = `${query} ${key}`;

      Object.keys(filters[key]).map(field => {
        query = `${query} ${field} = '${filters[key][field]}'`;
      });
    });

    const results = await db.query(query);

    return results.rows[0];
  },

  async create(data) {
    const query = `
      INSERT INTO  users (
        name,
        email,
        password,
        is_admin
      ) VALUES ($1, $2, $3, $4)
      RETURNING  id
    `;

    const values = [
      data.name,
      data.email,
      data.password,
      data.isAdmin,
    ];

    const results = await db.query(query, values);

    return results.rows[0];
  },

  update(data) {
    const query = `
      UPDATE users SET
        name=($1),
        email=($2),
        is_admin=($3)
      WHERE  id = $4
    `;

    const values = [
      data.name,
      data.email,
      data.isAdmin,
      data.id,
    ];

    return db.query(query, values);
  },
}