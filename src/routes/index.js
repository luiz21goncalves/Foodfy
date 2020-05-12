const express = require('express');
const routes = express.Router();

const home = require('./home');
const recipe = require('./recipe');
const chef = require('./chef');

routes.use('/', home);
routes.use('/admin/recipes', recipe);
routes.use('/admin/chefs', chef);

routes.get('/', (req, res) => res.redirect('/recipes'));
routes.get('/about', (req, res) => res.render('home/about'));
routes.get('/admin', (req, res) => res.redirect('/admin/recipes'));

module.exports = routes;
