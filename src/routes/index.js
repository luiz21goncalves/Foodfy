const express = require('express');
const routes = express.Router();

const home = require('./home');
const admin = require('./admin');
const session = require('./session');

routes.get('/', (req, res) => res.redirect('/recipes'));

routes.use('/', home);
routes.use('/admin', admin);
routes.use('/session', session);

module.exports = routes;
