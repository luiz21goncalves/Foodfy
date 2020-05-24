const Chef = require('../models/Chef');
const File = require('../models/File');

function checkAllFields(body) {
  const keys = Object.keys(body);

  for (key of keys) {
    if (body[key] == '' && key != 'removed_images')
      return {
        error: 'Por favor, preencha todos os campos.'
      };
  }
};

async function getChefImage(chef, req) {
  const results = await File.findOne(chef.file_id);
  const files = results.rows.map(file => ({
    ...file,
    src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
  }));
  
  return {
    ...chef,
    files
  }
};

async function checkChefs(req, res, next) {
  const results = await Chef.findOne(req.params.id || req.body.id);
  const chef = results.rows[0];
    
  if (!chef) {
    const results = await Chef.all();
    const filesPromise = results.rows.map(chef => getChefImage(chef, req));
    const chefs = await Promise.all(filesPromise);

    return res.render('chef/index', {
      error: 'Chef não encontrado!'
    })
  }
  req.chef = chef;

  next();
};

function post(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields)
    return res.render('chef/create', {
      error: 'Envie pelo menos uma imagem.',
      chef: req.body
    });
  
  if (req.files.length == 0)
    return res.render('chef/create', {
      ...thereIsImage,
      chef: req.body
    });

  next();
};

async function put(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  const results = await Chef.findOne(req.body.id);
  const chef = await getChefImage(results.rows[0], req);

  if (fillAllFields)
    return res.render('chef/edit', {
      ...fillAllFields,
      chef: {...chef, ...req.body}
    });
  
  if (req.body.removed_images && req.files.length == 0)
    return res.render('chef/edit', {
      error: 'Envie pelo menos uma imagem.',
      chef: {...chef, ...req.body}
    });

  req.chef = chef;

  next();
};

async function onlyAdmin(req, res, next) {
  if (!req.session.isAdmin) {
    const results = await Chef.all();
    const filesPromise = results.rows.map(chef => getChefImage(chef, req));
    const chefs = await Promise.all(filesPromise);

    return res.render('chef/index', {
      chefs,
      error: 'Você não tem permissão para criação, edição ou para deletar chefs.'
    })
  }

  next();
};

module.exports = {
  checkChefs,
  onlyAdmin,
  post,
  put,
};