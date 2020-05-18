const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');

const RecipeController = require('../app/controllers/RecipeController');
const RecipeValidator = require('../app/validators/recipe');

routes.get('/', RecipeController.index);
routes.get('/create', RecipeController.create);
routes.get('/:id', RecipeController.show);

routes.post('/', multer.array('images_recipes', 5), RecipeValidator.post,RecipeController.post);

module.exports = routes;