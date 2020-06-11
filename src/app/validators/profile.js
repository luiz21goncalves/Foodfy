const { compare } = require('bcryptjs');
const User = require('../models/User');

async function put(req, res, next) {
  const { password, id, email } = req.body;

  const user = await User.findOne({ where: { id } });
  const usedEmail = await User.findOne({ where: { email } });

  if (usedEmail && user.id != id)
    return res.render('profile/index', {
      user: req.body,
      error: 'Esse email pretence a outro usuário, por favor ulitize outro.',
    });

  const passed = await compare(password, user.password);

  if (!passed)
    return res.render('profile/index', {
      user: req.body,
      error: 'Senha incorreta.',
    });

  next();
}

module.exports = { put };
