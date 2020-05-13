const express = require('express');
const routes = express.Router();

routes.get('/', (req, res) => res.render('users/index'));

module.exports = routes;