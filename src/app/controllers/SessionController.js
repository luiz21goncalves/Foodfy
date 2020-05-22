module.exports = {
  formLogin(req, res) {
    return res.render('session/login');
  },

  login(req, res) {
    const user = req.user;
    req.session.userId = user.id;

    if (user.is_admin) {
      return res.redirect('/admin/profile');
    }

    return res.redirec('/admin/users');
  },
};