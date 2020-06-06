const express = require('express');
const routes = express.Router();

const home = require('./home');
const admin = require('./admin');
const session = require('./session');

const { onlyUsers } = require('../app/middlewares/session');

routes.get('/', (req, res) => res.redirect('/recipes'));

routes.use('/', home);
routes.use('/', session);

routes.use(onlyUsers);
routes.use('/admin', admin);

module.exports = routes;
