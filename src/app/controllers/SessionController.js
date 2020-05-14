

module.exports = {
  formLogin(req, res) {
    return res.render('session/login');
  },

  login(req, res) {
    return res.send(req.user);
  },

  formForgot(req, res) {
    return res.render('session/forgot-password');
  },

  formReset(req, res) { 
    return res.render('session/reset-password')
  },

};
