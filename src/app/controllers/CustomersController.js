const Recipe = require("../models/Recipe");
const Chef = require("../models/Chef");

module.exports = {
  async indexRecipes(req, res) {
    const { filter = '' } = req.query;
    
    const results = await Recipe.search(filter);
    const recipes = results.rows;
    
    return res.render("customers/index", { recipes, filter })
  },

  async indexChefs(req, res) {
    const results = await Chef.all();
    const chefs = results.rows
    
    return res.render("customers/chefs", { chefs })
  },

  async showRecipes(req, res) {
    const results = await Recipe.find(req.params.id);
    const recipe = results.rows[0];

    if (!recipe) return res.send("Receita não encontrada!");
    
    return res.render("customers/show", { recipe })
}
}