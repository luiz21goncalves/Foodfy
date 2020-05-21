const express = require('express');
const routes = express.Router();

const SessionController = require('../app/controllers/SessionController');
const SessionValidator = require('../app/validators/session');

routes.get('/login', SessionController.formLogin);

routes.post('/login', SessionValidator.login, SessionController.login);

module.exports = routes;