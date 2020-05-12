const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');

const ChefsController = require('../app/controllers/ChefsController');
const ChefValidator = require('../app/validators/chef');

routes.get('/', ChefsController.index);
routes.get('/create', ChefsController.create);
routes.get('/:id', ChefValidator.checkChef, ChefsController.show);
routes.get('/:id/edit', ChefValidator.checkChef, ChefsController.edit);
routes.post('/', multer.single('images_chefs'), ChefValidator.post, ChefsController.post);
routes.put('/', multer.single('images_chefs'), ChefValidator.put, ChefsController.put);
routes.delete('/',ChefValidator.checkChef, ChefsController.delete);

module.exports = routes;