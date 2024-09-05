const Chef = require('../models/Chef');
const LoadChefService = require('../services/LoadChefService');

async function redirect() {
  const filters = '';
  const limit = 16;
  const page = 1;

  const { chefs, pagination } = await LoadChefService.paginate({
    limit,
    page,
    filters,
  });

  return {
    chefs,
    pagination,
    error: 'Chef não encontrado!',
  };
}

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
    const data = await redirect();

    return res.render('chef/index', data);
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
    const data = await redirect();

    return res.render('chef/index', data);
  }

  if (fillAllFields) return res.send('Por favor, preencha todos os campos.');

  if (req.body.removed_images && req.files.length == 0)
    return res.send('Por favor, envie pelo menos uma image.');

  next();
}

async function onlyAdmin(req, res, next) {
  if (!req.session.isAdmin) {
    const chefs = await LoadChefService.load('chefs');

    return res.render('chef/index', {
      chefs,
      error:
        'Você não tem permissão para criação, edição ou para deletar chefs.',
    });
  }

  next();
}

module.exports = { checkChefs, onlyAdmin, post, put };
