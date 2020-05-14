const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');

const ChefController = require('../app/controllers/ChefController');
const ChefValidator = require('../app/validators/chef');

routes.get('/', ChefController.index);
routes.get('/create', ChefController.create);
routes.get('/:id', ChefValidator.checkChef, ChefController.show);
routes.get('/:id/edit', ChefValidator.checkChef, ChefController.edit);

routes.post(
  '/', 
  multer.single('images_chefs'), 
  ChefValidator.post,
  ChefController.post
);
routes.put(
  '/', 
  multer.single('images_chefs'), 
  ChefValidator.put, 
  ChefController.put
);

routes.delete('/', ChefValidator.checkChef, ChefController.delete);

module.exports = routes;