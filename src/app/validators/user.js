const User = require('../models/User');

async function post(req, res, next) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == '' && key != 'is_admin')
      return res.render('user/create', {
        user: req.body,
        error: 'Apenas o campo de admistrador não é obrigatório.'
      });
  }

  const user = await User.findOne({ where: { email: req.body.email } });

  if (user)
    return res.render('user/create', {
      user: req.body,
      error: 'Usuário  já cadastrado, <a href="/login">faça login</a> ou <a href="/forgot-password">recupere sua senha</a>.'
    })

  next();
};

module.exports = {
  post,
};