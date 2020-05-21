const User = require('../models/User');

async function checkUser(req, res, next) {
  const user = await User.findOne({ where: { id: req.params.id || req.body.id } });

  if (!user) {
    const users = await User.all();

    return res.render('user/index', {
      users,
      error: 'Usuário não encontrado.'
    });
  }

  req.user = user;

  next();
};

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
  checkUser,
  post,
};