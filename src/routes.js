const express = require("express");
const routes = express.Router();
const recipes = require("./app/controllers/recipes");
const chefs = require("./app/controllers/chefs");
const home = require("./app/controllers/home");

routes.get("/", function(req, res) {
  return res.redirect("/recipes");
});

routes.get("/about", function(req, res) {
  return res.render("about");
});

routes.get("/recipes", home.indexRecipes);
routes.get("/recipes/:id", home.showRecipes);

routes.get("/chefs", home.indexChefs)

routes.get("/admin", function(req, res) {
  return res.redirect("/admin/recipes");
});
routes.get("/admin/about", function(req, res) {
  return res.render("admin/about");
});
routes.get("/admin/recipes", recipes.index);
routes.get("/admin/recipes/create", recipes.create);
routes.get("/admin/recipes/:id", recipes.show);
routes.get("/admin/recipes/:id/edit", recipes.edit);
routes.post("/admin/recipes", recipes.post);
routes.put("/admin/recipes", recipes.put);
routes.delete("/admin/recipes", recipes.delete);

routes.get("/admin/chefs", chefs.index);
routes.get("/admin/chefs/create", chefs.create);
routes.get("/admin/chefs/:id", chefs.show);
routes.get("/admin/chefs/:id/edit", chefs.edit);
routes.post("/admin/chefs", chefs.post);
routes.put("/admin/chefs", chefs.put);
routes.delete("/admin/chefs", chefs.delete);

module.exports = routes;
