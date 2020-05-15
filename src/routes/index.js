const express = require('express');
const routes = express.Router();

const home = require('./home');

routes.use('/', home);

routes.get('/', (req, res) => res.redirect('/recipes'));

module.exports = routes;
