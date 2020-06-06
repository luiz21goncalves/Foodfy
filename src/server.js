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

server.listen(5000, () => console.log('server is running'));
