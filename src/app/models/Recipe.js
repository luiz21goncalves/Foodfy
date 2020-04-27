const db = require("../../config/db");
const { date } = require("../../lib/utils");

module.exports = {
  all() {
    try {
      return db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY created_at DESC`);
    } catch (err) {
      throw new Error(err);
    }
  },

  create(data) {
    try {
      const query = `
        INSERT INTO recipes (
          chef_id,
          title,
          ingredients,
          preparation,
          information
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `;

      const values = [
        data.chef_id,
        data.title,
        data.ingredients,
        data.preparation,
        data.information,
      ];

      return db.query(query, values);
    } catch (err) {
      throw new Error(err);
    }
  },

  find(id) {
    try {
      return db.query(
        `
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1`,
        [id]
      );
    } catch (err) {
      throw new Error(err);
    }
  },

  search(filter) {
    try {
      let query = `
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%'
        ORDER BY recipes.id
      `;

      return db.query(query);
    } catch (err) {
      throw new Error(err);
    }
  },

  update(data) {
    try {
      const query = `
        UPDATE recipes SET
          chef_id=($1),
          title=($2),
          ingredients=($3),
          preparation=($4),
          information=($5)
        WHERE id = $6
      `;

      const values = [
        data.chef_id,
        data.title,
        data.ingredients,
        data.preparation,
        data.information,
        data.id,
      ];

      return db.query(query, values);
    } catch (err) {
      throw new Error(err);
    }
  },

  delete(id) {
    try {
      return db.query(`DELETE FROM recipes WHERE id = $1`, [id]);
    } catch (err) {
      throw new Error(err);
    }
  },

  chefSelectOptions() {
    try {
      return db.query(`SELECT name, id FROM chefs`);
    } catch (err) {
      throw new Error(err);
    }
  },
};
