const db = require('../../config/db');

module.exports = {
  all() {
    return db.query(`
      SELECT chefs.*, COUNT(recipes) As total
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      GROUP BY chefs.id
      ORDER BY chefs.created_at DESC
    `);
  },

  findOne(id) {
    return db.query(`
      SELECT chefs.*, COUNT(recipes) As total
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      WHERE chefs.id = $1
      GROUP BY chefs.id`,
      [id]
    );
  },

  create(name, fileId) {
    const query = `
      INSERT INTO chefs (
        name,
        file_id
      ) VALUES ($1, $2)
      RETURNING id
    `;

    return db.query(query, [name, fileId]);
  },

  update(data) {
    const query = `
      UPDATE chefs SET
        name=($1),
        file_id=($2)
      WHERE id = $3
    `;

    return db.query(query, [ data.name, data.fileId, data.id ]);
  },

  findRecipeByChef(id) {
    return db.query(`
      SELECT recipes.*
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      WHERE recipes.chef_id = $1
      ORDER BY recipes.created_at DESC`,
      [id]
    );
  },

  delete(id) {
    return db.query(`DELETE FROM chefs WHERE id = $1`, [id]);
  }
}