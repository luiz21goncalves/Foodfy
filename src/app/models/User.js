const db = require('../../config/db');

module.exports = {
  async all() {
    const results = await db.query(
      `SELECT * FROM users ORDER BY created_at DESC`
    );

    return results.rows;
  },

  async findOne(filters) {
    let query = `SELECT * FROM users`;

    Object.keys(filters).map((key) => {
      query = `${query} ${key}`;

      Object.keys(filters[key]).map((field) => {
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
        is_admin,
        reset_token,
        reset_token_expires
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING  id
    `;

    const values = [
      data.name,
      data.email,
      data.password,
      data.isAdmin,
      data.token,
      data.now,
    ];

    const results = await db.query(query, values);

    return results.rows[0];
  },

  async update(id, fields) {
    let query = `UPDATE users SET`;

    Object.keys(fields).map((key, index, array) => {
      if (index + 1 < array.length) {
        query = `${query} ${key} = '${fields[key]}',`;
      } else {
        query = `
          ${query} ${key} = '${fields[key]}'
          WHERE id = ${id}
        `;
      }
    });

    await db.query(query);
  },

  delete(id) {
    return db.query(`DELETE FROM users WHERE id = $1`, [id]);
  },

  async recipeByUser(id) {
    const query = `
      SELECT recipes.*
      FROM users
      LEFT JOIN recipes ON (recipes.user_id = users.id)
      WHERE recipes.user_id = $1
    `;

    const results = await db.query(query, [id]);

    return results.rows;
  },
};
