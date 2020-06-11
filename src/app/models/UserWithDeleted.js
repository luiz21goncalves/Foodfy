const Base = require('./Base');

Base.init({ table: 'users_with_deleted' });

module.exports = { ...Base };
