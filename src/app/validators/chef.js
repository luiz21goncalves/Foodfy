const Chef = require('../models/Chef');

function checkAllFields(body) {
  const keys = Object.keys(body);

  for (key of keys) {
    if (body[key] == '' && key != 'removed_images') return {
      chef: body,
      error:'Por favor, preencha todos os dados!'
    };
  }
};

async function checkIfChefExists(id) {
  const results = await Chef.find(id);
  const chef = results.rows[0];

  if (!chef) return {
    error:'Chef não encontrado!'
  };

  return chef;
};

async function post(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) return res.render('chefs/create', fillAllFields)

  if (!req.file) return res.render('chefs/create', {
    chef: req.body,
    error:'Por Favor, envie pelo menos uma imagem!'
  });

  next()
};

async function checkChef(req, res, next) {
  const checkChef = await checkIfChefExists(req.params.id || req.body.id);

  if(checkChef.error) return res.render('chefs/index', checkChef);

  req.chef = checkChef;

  next();
};

async function put(req, res, next) {
  const fillAllFields = checkAllFields(req.body);
  const removedImage = req.body.removed_images;

  if (fillAllFields) return res.render('chefs/create', fillAllFields);

  if (!req.file && removedImage) return res.render('chefs/edit', {
    chef: req.body,
    error: 'Por favor envie uma imagem'
  });

  next();
};

module.exports = {
  post,
  checkChef,
  put,
}