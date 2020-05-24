const User = require('../models/User');

function checkAllFields(body) {
  const keys = Object.keys(body);

  for (key of keys) {
    if (body[key] == '' && key != 'is_admin')
      return {
        error: 'Apenas o campo de admistrador não é obrigatório.'
      };
  }
};

async function edit(req, res, next) {
  const user = await User.findOne({ where: { id: req.params.id } });

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
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields)
    return res.render('user/create', {
      ...fillAllFields,
      user: req.body,
    });

  const user = await User.findOne({ where: { email: req.body.email } });

  if (user)
    return res.render('user/create', {
      user: req.body,
      error: 'Usuário  já cadastrado, <a href="/login">faça login</a> ou <a href="/forgot-password">recupere sua senha</a>.'
    })

  next();
};

async function put(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields)
    return res.render('user/edit', {
      ...fillAllFields,
      user: req.body,
    });

  const user = await User.findOne({ where: { email: req.body.email } });

  if (user) {
    if (user.id != req.body.id)
    return res.render('user/edit', {
      user: req.body,
      error: 'Esse email pretence a outro usuário, por favor ulitize outro.'
    })
  }

  next();
};

async function deleteUser(req, res, next) {
  const loggedUserId = req.session.userId;
  const user = await User.findOne({ where: { id: req.body.id} });

  if (!user) {
    const users = await User.all();

    return res.render('user/index', {
      users,
      error: 'Usuário não encontrado.'
    });
  }

  if (user.id == loggedUserId) {
    const users = await User.all();

    return res.render('user/index', {
      users,
      error: 'Você não pode deletar sua próprio usuário.'
    });
  }

  req.user = user;

  next();
};

module.exports = {
  edit,
  post,
  put,
  deleteUser,
};