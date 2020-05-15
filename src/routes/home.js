const express = require('express');
const routes  = express.Router();

const HomeController = require('../app/controllers/HomeController');

routes.get('/recipes', HomeController.index);
routes.get('/recipes/:id', HomeController.recipe);
routes.get('/chefs', HomeController.chefs);
routes.get('/about', HomeController.about);

module.exports = routes;