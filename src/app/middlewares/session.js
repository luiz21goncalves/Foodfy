function onlyUsers(req, res, next) {
  if (!req.session.userId) return res.redirect('/login');

  next();
}

function isLogged(req, res, next) {
  if (req.session.userId) return res.redirect('/admin');

  next();
}

function onlyAdmin(req, res, next) {
  if (!req.session.isAdmin) return res.redirect('/admin/profile');

  next();
}

module.exports = {
  onlyUsers,
  onlyAdmin,
  isLogged,
};
