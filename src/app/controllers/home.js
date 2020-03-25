const Recipe = require("../models/recipe");
const Chefs = require("../models/chef");

module.exports = {
  indexRecipes(req, res) {
    const { filter = "" } = req.query;
    
    const params = {
      filter,
      callback(recipes) {
        return res.render("index", { recipes, filter })
      }
    }
    
    Recipe.search(params)
   
  },

  indexChefs(req, res) {
    Chefs.all(function(chefs) {
      return res.render("chefs", {chefs})
    })
  },

  showRecipes(req, res) {
    Recipe.find(Number(req.params.id), function(recipe) {
      if (!recipe) return res.send("Receita não encontrada!");
      
      return res.render("show", { recipe })
    })
  }
}