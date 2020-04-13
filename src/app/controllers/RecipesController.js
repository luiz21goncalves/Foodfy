const Recipe = require("../models/recipe");

module.exports = {
  index(req ,res) {
    Recipe.all(function(recipes) {
      return res.render("recipes/index", { recipes });
    })
  },
  create(req, res) {  
    const recipe = {
      ingredient: "",
      preparation: ""
    }

    Recipe.chefSelectOptions(function(chefs) {
      return res.render("recipes/create", { recipe, chefs })
    })

  },
  post(req ,res) {
    const keys = Object.keys(req.body);
  
    for (key of keys) {
      if (req.body[key] != "" || req.body.information == "") {
      } else {
        return res.send("Apenas o campo de informações adicionais não é obrigatório")
      }
    }
  
    Recipe.create(req.body, function(recipe) {
      return res.redirect(`recipes/${recipe.id}`);
    })
  },
  show(req, res) {
    Recipe.find(Number(req.params.id), function(recipe) {
      if (!recipe) return res.send("Receita não encontrada");

      return res.render("recipes/show", { recipe });
    })
  },
  edit(req, res) {
    Recipe.find(Number(req.params.id), function(recipe) {
      if (!recipe) return res.send("Receita não encontrada");

      Recipe.chefSelectOptions(function(chefs) {
        return res.render("recipes/edit", { recipe, chefs })
      })
    })
  },
  put(req, res) {
    const keys = Object.keys(req.body);
  
    for (key of keys) {
      if (req.body[key] != "" || req.body.information == "") {
      } else {
        return res.send("Apenas o campo de informações adicionais não é obrigatório")
      }
    }
    
    Recipe.update(req.body, function() {
      return res.redirect(`/admin/recipes/${req.body.id}`);
    })
  },
  delete(req, res) {
    Recipe.delete(req.body.id, function() {
      return res.redirect("/admin/recipes");
    })    
  }
}
