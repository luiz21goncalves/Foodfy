const express = require('express');
const routes = express.Router();

routes.get('/login', (req, res) => res.render('session/login'));

module.exports = routes;