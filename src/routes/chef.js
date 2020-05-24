const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');

const ChefController = require('../app/controllers/ChefController');
const ChefValidator = require('../app/validators/chef');

routes.get('/', ChefController.index);
routes.get('/create', ChefValidator.onlyAdmin, ChefController.create);
routes.get('/:id', ChefValidator.checkChefs, ChefController.show);

routes.use(ChefValidator.onlyAdmin);

routes.get('/:id/edit', ChefValidator.checkChefs, ChefController.edit);
routes.post('/', multer.array('images_chefs', 1),ChefValidator.post, ChefController.post);
routes.put('/', multer.array('images_chefs', 1),ChefValidator.put, ChefController.put);
routes.delete('/', ChefValidator.checkChefs, ChefController.delete);

module.exports = routes;