const express = require('express');

const routes = express.Router();

const HomeController = require('../app/controllers/HomeController');
const HomeValidator = require('../app/validators/home');

routes.get('/recipes', HomeController.index);
routes.get('/recipes/search', HomeValidator.search, HomeController.search);
routes.get('/recipes/:id', HomeValidator.checkRecipe, HomeController.recipe);

routes.get('/chefs', HomeController.chefs);
routes.get('/chefs/:id', HomeValidator.checkChef, HomeController.chefShow);

routes.get('/about', HomeController.about);

module.exports = routes;
