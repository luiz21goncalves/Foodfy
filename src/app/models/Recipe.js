const db = require('../../config/db');

module.exports = {
  find() {
    return db.query(`SELECT * FROM recipes`);
  }
}