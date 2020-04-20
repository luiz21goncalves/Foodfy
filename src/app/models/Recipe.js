const db = require("../../config/db");
const { date } = require("../../lib/utils");

module.exports = {
  all() {
    try {
      return db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY recipes.id`
      );
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
          information,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `;
  
      const values = [
        data.chef_id,
        data.title,
        data.ingredients,
        data.preparation,
        data.information,
        date(Date.now()).iso
      ];
  
       return db.query(query, values);
    } catch (err) {
      throw new Error(err);
    }
  },

  find(id) {
    try {
      return db.query(`
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
          image=($2),
          title=($3),
          ingredients=($4),
          preparation=($5),
          information=($6)
        WHERE id = $7
      `;
    
      const values = [
        data.chef_id,
        data.image,
        data.title,
        data.ingredients,
        data.preparation,
        data.information,
        data.id
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
  }
}