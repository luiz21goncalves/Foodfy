const express = require('express');

const routes = express.Router();

const ProfileController = require('../app/controllers/ProfileController');
const ProfileValidator = require('../app/validators/profile');

routes.get('/', ProfileController.index);
routes.put('/', ProfileValidator.put, ProfileController.put);

module.exports = routes;
