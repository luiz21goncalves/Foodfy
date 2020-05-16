const express = require('express');
const routes  = express.Router();

const HomeController = require('../app/controllers/HomeController');
const RecipeValidator = require('../app/validators/recipe');
const ChefValidator = require('../app/validators/chef');

routes.get('/recipes', HomeController.index);
routes.get('/recipes/search', RecipeValidator.search, HomeController.search);
routes.get('/recipes/:id', RecipeValidator.checkRecipe, HomeController.recipe);

routes.get('/chefs', HomeController.chefs);
routes.get('/chefs/:id', ChefValidator.checkChefs, HomeController.chefShow);

routes.get('/about', HomeController.about);

module.exports = routes;