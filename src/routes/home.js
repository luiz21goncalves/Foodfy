const express = require('express');
const routes = express.Router();

const HomeController = require('../app/controllers/HomeController');
const HomeValidator = require('../app/validators/home');

routes.get('/recipes', HomeController.indexRecipes);
routes.get('/recipes/search', HomeValidator.search, HomeController.search);
routes.get('/recipes/:id', HomeValidator.checkRecipe, HomeController.showRecipes);

routes.get('/chefs', HomeController.indexChefs);
routes.get('/chefs/:id', HomeValidator.checkChef, HomeController.showChef);

module.exports = routes;