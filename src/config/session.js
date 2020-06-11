const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const db = require('./db');

module.exports = session({
  store: new PgSession({
    pool: db,
  }),
  secret: process.env.SESSION_SECRET,
  resave: process.env.SESSION_RESAVE,
  saveUninitialized: process.env.SESSION_SAVE_UNITIALIZED,
  cookie: {
    maxAge: process.env.SESSION_COOKIE_MAX_AGE,
  },
});
