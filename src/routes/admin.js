const express = require('express');
const routes = express.Router();

const recipe = require('./recipe');
const chef = require('./chef');

routes.use('/recipes', recipe);
routes.use('/chefs', chef);

routes.get('/', (req, res) => res.redirect('/admin/recipes'));

module.exports = routes;