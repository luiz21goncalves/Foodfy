const express = require('express');
const routes = express.Router();

const RecipeController = require('../app/controllers/RecipeController');

routes.get('/', RecipeController.index);
routes.get('/create', RecipeController.create);
routes.get('/:id', RecipeController.show);

routes.post('/', RecipeController.post);

module.exports = routes;