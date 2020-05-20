const Chef = require('../models/Chef');

function checkAllFields(body) {
  const keys = Object.keys(body);

  for (key of keys) {
    if (body[key] == '' && key != 'removed_images')
      return {
        error: 'Por favor, preencha todos os campos.'
      };
  }
};

function checkForImages(files) {
  if (files.length == 0)
    return {
      error: 'Envie pelo menos uma imagem,'
    };
};

async function checkChefs(req, res, next) {
  const results = await Chef.findOne(req.params.id || req.body.id);
  const chef = results.rows[0];
  
  if (!chef) return res.render('chef/index', {
    error: 'Chef não encontrado!'
  })

  req.chef = chef;

  next();
};

function post(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields)
    return res.render('chef/create', {
      ...fillAllFields,
      chef: req.body
    });
  
  const thereIsImage = checkForImages(req.files);

  if (thereIsImage)
    return res.render('chef/create', {
      ...thereIsImage,
      chef: req.body
    });

  next();
};

function put(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields)
    return res.render('chef/edit', {
      ...fillAllFields,
      chef: req.body
    });
  
  const thereIsImage = checkForImages(req.files);

  if (thereIsImage)
    return res.render('chef/edit', {
      ...thereIsImage,
      chef: req.body
    });

  next();
};

module.exports = {
  checkChefs,
  post,
  put,
};