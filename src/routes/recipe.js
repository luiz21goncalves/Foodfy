const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');

const RecipesController = require('../app/controllers/RecipesController');
const RecipeValidator = require('../app/validators/recipe');

routes.get('/', RecipesController.index);
routes.get('/create', RecipesController.create);
routes.get('/:id', RecipeValidator.checkRecipe,RecipesController.show);
routes.get('/:id/edit', RecipeValidator.checkRecipe, RecipesController.edit);
routes.post('/', multer.array('images_recipes', 5), RecipeValidator.post, RecipesController.post);
routes.put('/', multer.array('images_recipes', 5), RecipesController.put);
routes.delete('/', RecipeValidator.checkRecipe, RecipesController.delete);

module.exports = routes;