

module.exports = {
  formLogin(req, res) {
    return res.render('session/login');
  },

  login(req, res) {
    console.log(req.session);

    return res.redirect('/admin');
  },

  formForgot(req, res) {
    return res.render('session/forgot-password');
  },

  formReset(req, res) { 
    return res.render('session/reset-password')
  },

};
