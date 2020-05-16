const express = require('express');
const routes  = express.Router();

const HomeController = require('../app/controllers/HomeController');
const RecipeValidator = require('../app/validators/recipe');

routes.get('/recipes', HomeController.index);
routes.get('/recipes/:id', RecipeValidator.checkRecipe, HomeController.recipe);

routes.get('/chefs', HomeController.chefs);
routes.get('/chefs/:id', HomeController.chefs);

routes.get('/about', HomeController.about);

module.exports = routes;