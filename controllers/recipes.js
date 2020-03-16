const fs = require("fs");
const data = require("../data.json");

exports.index = function(req ,res) {
  return res.render("admin/index", { recipes: data.recipes });
};

exports.create = function(req, res) {
  const recipe = {
    id:"",
    title: "",
    author: "",
    image: "",
    ingredients: "",
    preparation: "",
    information:""
  }

  return res.render("admin/create", {recipe})
};

exports.post = function(req ,res) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] != "" || req.body.information == "") {
    } else {
      return res.send("Apenas o campo de informações adicionais não é obrigatório")
    }
  }

  let id = 1;
  const lastRecipe = data.recipes[data.recipes.length - 1];
  
  if (lastRecipe) {
    id = lastRecipe.id + 1;
  }


  data.recipes.push({
    id,
    ...req.body,
  });

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Erro ao salvar o aquivo!")

    return res.redirect(`/admin/recipes/${id}`);
  });

};

exports.show = function(req, res) {
  const { id } = req.params;

  const fonudRecipe = data.recipes.find(function(recipe) {
    return recipe.id == id;
  });

  if (!fonudRecipe) return res.send("Receita não encontrada");

  const recipe = {
    ...fonudRecipe,
  };


  return res.render("admin/show", { recipe });
};

exports.edit = function(req, res) {
  const { id } = req.params;

  const fonudRecipe = data.recipes.find(function(recipe) {
    return recipe.id == id;
  });

  if (!fonudRecipe) return res.send("Receita não encontrada")

  const recipe = {
    ...fonudRecipe,
  };

  return res.render("admin/edit", { recipe })
}

exports.put = function (req, res) {
  const { id } = req.body
  let index = 0

  const fonudRecipe = data.recipes.find(function(recipe, foundIndex) {
    if (id == recipe.id) {
      index = foundIndex;
      return true
    }
  });

  if (!fonudRecipe) return res.send("Receita não encontrada");

  const recipe = {
    ...fonudRecipe,
    ...req.body,
    id:  Number(req.body.id),
  }

  data.recipes[index] = recipe

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Erro ao salvar o aquivo!")

    return res.redirect(`/admin/recipes/${id}`);
  });
};

exports.delete = function(req, res) {
  const { id } = req.body;

  const fonudRecipe = data.recipes.filter(function(recipe) {
    return recipe.id != id;
  });

  data.recipes = fonudRecipe

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Erro ao salvar o aquivo!")
  });
  
  return res.redirect("/admin/recipes");
};