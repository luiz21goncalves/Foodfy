const express = require('express');

const routes = express.Router();

const UserController = require('../app/controllers/UserController');
const UserValidator = require('../app/validators/user');

const { onlyAdmin } = require('../app/middlewares/session');

routes.use(onlyAdmin);

routes.get('/', UserController.index);
routes.get('/create', UserController.create);
routes.get('/:id/edit', UserValidator.edit, UserController.edit);

routes.post('/', UserValidator.post, UserController.post);
routes.put('/', UserValidator.put, UserController.put);
routes.delete('/', UserValidator.deleteUser, UserController.delete);

module.exports = routes;
