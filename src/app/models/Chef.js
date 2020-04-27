const db = require("../../config/db");
const { date } = require("../../lib/utils");

module.exports = {
  all() {
    try {
      return db.query(`
        SELECT chefs.*, COUNT(recipes) AS total
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        GROUP BY chefs.id
        ORDER BY chefs.id
      `);
    } catch (err) {
      throw new Error(err);
    }
  },

  find(id) {
    try {
      return db.query(`
        SELECT chefs.*, COUNT(recipes) AS total
        FROM chefs 
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1
        GROUP BY chefs.id`,
        [id]
      );
    } catch (err) {
      throw new Error(err);
    }
  },

  findRecipesByChef(id) {
    try {
      return db.query(`
        SELECT recipes.*
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        WHERE recipes.chef_id = $1
        ORDER BY recipes.id`,
        [id]
      );
    } catch (err) {
      throw new Error(err);
    }
  },

  create(data) {
    try {
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
    } catch (err) {
      throw new Error(err);
    }
  },

  update(data) {
    try {
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
    } catch (err) {
      throw new Error(err);
    }
  },

  delete(id) {
    try {
      return db.query(`DELETE FROM chefs WHERE id = $1`, [id]);
    } catch (err) {
      throw new Error(err);
    }
  }
}