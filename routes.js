const express = require("express");
const routes = express.Router();
const data = require("./data");
const recipes = require("./controllers/recipes");

routes.get("/", function(req, res) {
  return res.redirect("/recipes");
});
routes.get("/about", function(req, res) {
  return res.render("about");
});
routes.get("/recipes", function(req, res) {
  return res.render("index", { recipes: data })
});
routes.get("/recipes/:id", function(req, res) {
  const recipeId = req.params.id;

  return res.render("recipe", { recipe: data[recipeId] });
});

routes.get("/admin", function(req, res) {
  return res.redirect("/admin/recipes");
});
routes.get("/admin/about", function(req, res) {
  return res.render("admin/about");
});
routes.get("/admin/recipes", recipes.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", recipes.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", recipes.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", recipes.edit); // Mostrar formulário de edição de receita

routes.post("/admin/recipes", recipes.post); // Cadastrar nova receita
// routes.put("/admin/recipes", recipes.put); // Editar uma receita
// routes.delete("/admin/recipes", recipes.delete); // Deletar uma receita

module.exports = routes;
