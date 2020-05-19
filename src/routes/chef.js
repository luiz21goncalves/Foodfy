const express = require('express');
const routes = express.Router();

const ChefController = require('../app/controllers/ChefController');
const ChefValidator = require('../app/validators/chef');

routes.get('/', ChefController.index);
routes.get('/create', ChefController.create);
routes.get('/:id', ChefValidator.checkChefs, ChefController.show);
routes.get('/:id/edit', ChefValidator.checkChefs, ChefController.edit);

module.exports = routes;