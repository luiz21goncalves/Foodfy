const express = require('express');
const routes = express.Router();

const home = require('./home');
const recipe = require('./recipe');
const chef = require('./chef');
const session = require('./session');
const user = require('./user');

routes.use('/', home);
routes.use('/admin', session);
routes.use('/admin/recipes', recipe);
routes.use('/admin/chefs', chef);
routes.use('/admin/users', user);

routes.get('/', (req, res) => res.redirect('/recipes'));
routes.get('/about', (req, res) => res.render('home/about'));
routes.get('/admin', (req, res) => res.redirect('/admin/recipes'));
routes.get('/login', (req, res) => res.redirect('/admin/login'));
routes.get('/forgot', (req, res) => res.redirect('/admin/forgot-password'));

module.exports = routes;
