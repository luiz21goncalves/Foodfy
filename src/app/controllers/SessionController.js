module.exports = {
  formLogin(req, res) {
    return res.render('session/login');
  },

  login(req, res) {
    console.log(req.session)
    return res.send(req.body);
  },
};