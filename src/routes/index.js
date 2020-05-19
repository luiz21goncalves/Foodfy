const express = require('express');
const routes = express.Router();

const home = require('./home');
const admin = require('./admin');

routes.get('/', (req, res) => res.redirect('/recipes'));

routes.use('/', home);
routes.use('/admin', admin);

module.exports = routes;
