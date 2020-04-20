const express = require('express');
const routes = express.Router();
const multer = require('./app/middlewares/multer');
const RecipesController = require('./app/controllers/RecipesController');
const ChefsController = require('./app/controllers/ChefsController');
const CustomersController = require('./app/controllers/CustomersController');

routes.get('/', function(req, res) {
  return res.redirect('/recipes');
});

routes.get('/about', function(req, res) {
  return res.render('customers/about');
});

routes.get('/recipes', CustomersController.indexRecipes);
routes.get('/recipes/:id', CustomersController.showRecipes);

routes.get('/chefs', CustomersController.indexChefs)

routes.get('/admin', function(req, res) {
  return res.redirect('/admin/recipes');
});
routes.get('/admin/about', function(req, res) {
  return res.render('admin/about');
});
routes.get('/admin/recipes', RecipesController.index);
routes.get('/admin/recipes/create', RecipesController.create);
routes.get('/admin/recipes/:id', RecipesController.show);
routes.get('/admin/recipes/:id/edit', RecipesController.edit);
routes.post('/admin/recipes', multer.array('images_recipes', 5),RecipesController.post);
routes.put('/admin/recipes', multer.array('images_recipes', 5),RecipesController.put);
routes.delete('/admin/recipes', RecipesController.delete);

routes.get('/admin/chefs', ChefsController.index);
routes.get('/admin/chefs/create', ChefsController.create);
routes.get('/admin/chefs/:id', ChefsController.show);
routes.get('/admin/chefs/:id/edit', ChefsController.edit);
routes.post('/admin/chefs', multer.array('images_chefs', 1), ChefsController.post);
routes.put('/admin/chefs', multer.array('images_chefs', 1), ChefsController.put);
routes.delete('/admin/chefs', ChefsController.delete);

module.exports = routes;
