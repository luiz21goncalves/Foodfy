const express = require('express');
const routes = express.Router();

const recipe = require('./recipe');

routes.use('/recipes', recipe);

routes.get('/', (req, res) => res.redirect('/admin/recipes'));

module.exports = routes;