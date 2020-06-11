const User = require('../models/User');
const UserWithDeleted = require('../models/UserWithDeleted');

async function redirect() {
  const filters = '';
  const limit = 9;
  const page = 1;
  const offset = Math.ceil(limit * (page - 1));

  const users = await User.paginate({ filters, offset, limit });

  const count = await User.count();

  const pagination = { total: Math.ceil(count / limit), page };

  return { users, pagination, error: 'Usuário não encontrado.' };
}

function checkAllFields(body) {
  const keys = Object.keys(body);

  for (const key of keys) {
    if (body[key] == '' && key != 'is_admin') {
      return 'Apenas o campo de admistrador não é obrigatório.';
    }
  }
}

async function edit(req, res, next) {
  const user = await User.findOne({ where: { id: req.params.id } });

  if (!user) {
    const data = await redirect();

    return res.render('user/index', data);
  }

  req.user = user;

  next();
}

async function post(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) return res.send(fillAllFields);

  const user = await UserWithDeleted.findOne({
    where: { email: req.body.email },
  });

  if (user)
    return res.render('user/create', {
      user: req.body,
      error: 'Email não disponível, por favor dente outro.',
    });

  next();
}

async function put(req, res, next) {
  const user = await User.findOne({ where: { id: req.body.id } });

  if (!user) {
    const data = await redirect();

    return res.render('user/index', data);
  }

  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) return res.send(fillAllFields);

  const emailAvailable = await UserWithDeleted.findOne({
    where: { email: req.body.email },
  });

  if (emailAvailable) {
    return res.render('user/edit', {
      user: req.body,
      error: 'Esse email pretence a outro usuário, por favor ulitize outro.',
    });
  }

  next();
}

async function deleteUser(req, res, next) {
  const loggedUserId = req.session.userId;
  const user = await User.findOne({ where: { id: req.body.id } });

  if (!user) {
    const data = await redirect();

    return res.render('user/index', data);
  }

  if (user.id == loggedUserId) {
    const data = await redirect();

    return res.render('user/index', {
      ...data,
      error: 'Você não pode deletar seu próprio usuário.',
    });
  }

  req.user = user;

  next();
}

module.exports = { edit, post, put, deleteUser };
