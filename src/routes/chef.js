const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');
const ChefsController = require('../app/controllers/ChefsController');

const ChefValidator = require('../app/validators/chef');

routes.get('/', ChefsController.index);
routes.get('/create', ChefsController.create);
routes.get('/:id', ChefValidator.checkChefs, ChefsController.show);
routes.get('/:id/edit', ChefValidator.checkChefs, ChefsController.edit);
routes.post('/', ChefValidator.post, multer.single('images_chefs'), ChefsController.post);
routes.put('/', ChefValidator.put, multer.single('images_chefs'), ChefsController.put);
routes.delete('/',ChefValidator.checkChefs, ChefsController.delete);

module.exports = routes;