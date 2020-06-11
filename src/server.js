const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const express = require('express');
const nunjuncks = require('nunjucks');
const methodOverride = require('method-override');
const session = require('./config/session');
const routes = require('./routes');

const server = express();

server.use(session);
server.use((req, res, next) => {
  res.locals.session = req.session;

  next();
});

server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));
server.use(methodOverride('_method'));
server.use(routes);
server.set('view engine', 'njk');

nunjuncks.configure('src/app/views', {
  express: server,
  autoescape: false,
  noCache: true,
});

server.use((req, res) => res.status(404).render('not-found'));

server.listen(process.env.PORT || 5000, () => console.log('server is running'));
