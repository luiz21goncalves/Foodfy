const express = require('express');
const routes = express.Router();

const SessionController = require('../app/controllers/SessionController');

const SessionValidator = require('../app/validators/session');

const { isLogged } = require('../app/middlewares/session');


routes.get('/login', isLogged, SessionController.formLogin);
routes.post('/login', SessionValidator.login, SessionController.login);
routes.post('/logout', SessionController.logout);

routes.get('/forgot-password', SessionController.formForgot);
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot);

routes.get('/reset-password', SessionController.formReset);
routes.post('/reset-password', SessionValidator.reset, SessionController.reset);

module.exports = routes;