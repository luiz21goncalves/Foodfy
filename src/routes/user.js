const express = require('express');
const routes = express.Router();

const UserController = require('../app/controllers/UserController');
const UserValidator = require('../app/validators/user');

routes.get('/', UserController.list);
routes.get('/create', UserController.create);
routes.get('/:id/edit', UserValidator.checkUser, UserController.edit);

routes.post('/', UserValidator.post, UserController.post);
routes.put('/', UserValidator.put, UserController.put);

module.exports = routes;