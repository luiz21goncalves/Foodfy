const express = require('express');
const routes  = express.Router();

const HomeController = require('../app/controllers/HomeController');

routes.get('/recipes', HomeController.recipes);
routes.get('/chefs', HomeController.recipes);
routes.get('/about', HomeController.about);

module.exports = routes;