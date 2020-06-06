const express = require('express');

const routes = express.Router();

const ProfileController = require('../app/controllers/ProfileController');

routes.get('/', ProfileController.index);
routes.put('/', ProfileController.put);

module.exports = routes;
