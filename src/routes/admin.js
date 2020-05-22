const express = require('express');
const routes = express.Router();

const recipe = require('./recipe');
const chef = require('./chef');
const user = require('./user');
const profile = require('./profile');

routes.get('/', (req, res) => res.redirect('/admin/recipes'));

routes.use('/recipes', recipe);
routes.use('/chefs', chef);
routes.use('/profile', profile);
routes.use('/users', user);

module.exports = routes;