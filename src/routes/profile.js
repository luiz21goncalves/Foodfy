const express = require('express');
const routes = express.Router();

const ProfileController = require('../app/controllers/ProfileController');

routes.get('/', ProfileController.index);

module.exports = routes;