const Chef = require('../models/Chef');
const LoadChefServce = require('../services/LoadChefService');

function checkAllFields(body) {
  const keys = Object.keys(body);

  for (const key of keys) {
    if (body[key] == '' && key != 'removed_images')
      return 'Por favor, preencha todos os campos.';
  }
}

async function checkChefs(req, res, next) {
  const chef = await Chef.findOne({
    where: { id: req.params.id || req.body.id },
  });

  if (!chef) {
    const chefs = await LoadChefServce.load('chefs');

    return res.render('chef/index', {
      chefs,
      error: 'Chef não encontrado!',
    });
  }

  req.chef = chef;

  next();
}

function post(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) return res.send(fillAllFields);

  if (req.files.length == 0)
    return res.send('Por favor, envie pelo menos uma image.');

  next();
}

async function put(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  const chef = await Chef.findOne({ where: { id: req.body.id } });

  if (!chef) {
    const chefs = await LoadChefServce.load('chefs');

    return res.render('chef/index', {
      chefs,
      error: 'Chef não encontrado!',
    });
  }

  if (fillAllFields) return res.send('Por favor, preencha todos os campos.');

  if (req.body.removed_images && req.files.length === 0)
    return res.send('Por favor, envie pelo menos uma image.');

  next();
}

async function onlyAdmin(req, res, next) {
  if (!req.session.isAdmin) {
    const chefs = await LoadChefServce.load('chefs');

    return res.render('chef/index', {
      chefs,
      error:
        'Você não tem permissão para criação, edição ou para deletar chefs.',
    });
  }

  next();
}

module.exports = {
  checkChefs,
  onlyAdmin,
  post,
  put,
};
