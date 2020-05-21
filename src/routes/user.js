const express = require('express');
const routes = express.Router();

const UserController = require('../app/controllers/UserController');
const UserValidator = require('../app/validators/user');

routes.get('/', UserController.index);
routes.get('/create', UserController.create);

routes.post('/', UserValidator.post, UserController.post);

module.exports = routes;