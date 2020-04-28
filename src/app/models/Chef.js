const db = require("../../config/db");
const { date } = require("../../lib/utils");

module.exports = {
  all() {
    return db.query(`
      SELECT chefs.*, COUNT(recipes) AS total
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      GROUP BY chefs.id
      ORDER BY chefs.id
    `);
  },

  find(id) {
    return db.query(`
      SELECT chefs.*, COUNT(recipes) AS total
      FROM chefs 
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      WHERE chefs.id = $1
      GROUP BY chefs.id`,
      [id]
    );
 
  },

  findRecipesByChef(id) {
    return db.query(`
      SELECT recipes.*
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      WHERE recipes.chef_id = $1
      ORDER BY recipes.created_at DESC`,
      [id]
    );
  },

  create(data) {
    const query = `
      INSERT INTO chefs (
        name,
        file_id
      ) VALUES ($1,$2)
      RETURNING id
    `;

    const values = [
      data.name,
      data.fileId,
    ];

    return db.query (query, values);
  
  },

  update(data) {
    const query = `
      UPDATE chefs SET
        name=($1),
        file_id=($2)
      WHERE id = $3
    `;
  
    const values = [
      data.name,
      data.fileId,
      data.id,
    ];

    return db.query(query, values);
  },

  delete(id) {
    return db.query(`DELETE FROM chefs WHERE id = $1`, [id]);
  }
}
