const db = require('../../config/db');

module.exports = {
  create(data) {
    try {
      const query = `
        INSERT INTO files (
          name,
          path
        ) VALUES ($1, $2)
        RETURNING id
      `;

      const values = [
        data.filename,
        data.path
      ];

      return db.query(query, values);
    } catch (err) {
      throw new Error(err);
    }
  },

  all() {
    try {
      return db.query(`SELECT * FROM files`);
    } catch (err) {
      throw new Erro(err);
    }
  },

  find(id) {
    try {
      return db.query(`SELECT * FROM files WHERE files.id = $1`, [id]);
    } catch (err) {
      throw new Error(err);
    }
  },

};