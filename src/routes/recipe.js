const express = require('express');

const routes = express.Router();
const multer = require('../app/middlewares/multer');

const RecipeController = require('../app/controllers/RecipeController');
const RecipeValidator = require('../app/validators/recipe');

routes.get('/', RecipeController.index);
routes.get('/create', RecipeController.create);
routes.get('/:id', RecipeValidator.show, RecipeController.show);
routes.get('/:id/edit', RecipeValidator.edit, RecipeController.edit);

routes.post(
  '/',
  multer.array('images_recipes', 5),
  RecipeValidator.post,
  RecipeController.post
);
routes.put(
  '/',
  multer.array('images_recipes', 5),
  RecipeValidator.put,
  RecipeController.put
);
routes.delete('/', RecipeValidator.deleteRecipe, RecipeController.delete);

module.exports = routes;
