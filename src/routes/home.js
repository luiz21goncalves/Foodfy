const express = require('express');
const routes = express.Router();

const HomeController = require('../app/controllers/HomeController');

routes.get('/recipes', HomeController.indexRecipes);
routes.get('/recipes/search', HomeController.search);
routes.get('/recipes/:id', HomeController.showRecipes);

routes.get('/chefs', HomeController.indexChefs);
routes.get('/chefs/:id', HomeController.showChef);

module.exports = routes;