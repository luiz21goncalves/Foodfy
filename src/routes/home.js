const express = require('express');
const routes  = express.Router();

const HomeController = require('../app/controllers/HomeController');

routes.get('/recipes', HomeController.recipes);

module.exports = routes;