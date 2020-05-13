const express = require('express');
const routes = express.Router();

routes.get('/login', (req, res) => res.render('session/login'));
routes.get('/forgot-password', (req, res) => res.render('session/forgot-password'));
routes.get('/reset-password', (req, res) => res.render('session/reset-password'));

module.exports = routes;