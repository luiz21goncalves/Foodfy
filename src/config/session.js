const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const db = require('./db');

module.exports = session({
  store: new pgSession({
    pool: db
  }),
  secret: 'senhadificil',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000
  }
});