const Chef = require ("../models/chef");

module.exports = {
  index(req, res) {
    Chef.all(function(chefs) {
      return res.render("chefs/index", { chefs });
    })
  },

  create(req, res) {
    return res.render("chefs/create");
  },

  post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Por favor, preencha todos os dados!")
      }
    }

    Chef.create(req.body, function(chef) {
      return res.redirect(`chefs/${chef.id}`)
    });
  },

  show(req, res) {
    Chef.find(req.params.id, function(chef) {
      if (!chef) return res.send("Chef não encontrado!");
      
      Chef.findRecepesByChef(req.params.id, function(recipes) {
        return res.render("chefs/show", { chef, recipes });
      })
    })
  },

  edit(req, res) {
    Chef.find(req.params.id, function(chef) {
      if (!chef) return res.send("Chef não encontrado!");

      return res.render("chefs/edit", { chef });
    });
  },

  put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Por favor, preencha todos os dados!")
      }
    }

    Chef.update(req.body, function() {
      return res.redirect(`/admin/chefs/${req.body.id}`)
    })
  },

  delete(req, res) {
    Chef.findRecepesByChef(req.body.id, function(recipes) {
      if (recipes == "") {
        Chef.delete(req.body.id, function() {
          return res.redirect("/admin/chefs");
        })
      } else {
        const recipeTitle = [];

        for (recipe of recipes) {
          recipeTitle.push(recipe.title)
        }
        
        return res.send(`Esse chefe possui pelo menos uma receita cadastrada! Delete ${recipeTitle} antes de tentar novamente.`)
      }
    })
  }
}