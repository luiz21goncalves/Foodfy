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

function checkForImages(files) {
  if (files.length == 0)
    return {
      error: 'Envie pelo menos uma imagem,'
    };
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

async function put(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  const results = await Chef.findOne(req.body.id);
  const chef = await getChefImage(results.rows[0], req);

  if (fillAllFields)
    return res.render('chef/edit', {
      ...fillAllFields,
      chef: {...chef, ...req.body}
    });
  
  const thereIsImage = checkForImages(req.files);

  if (req.body.removed_images) {
    if (thereIsImage)
      return res.render('chef/edit', {
        ...thereIsImage,
        chef: {...chef, ...req.body}
      });
  }

  req.chef = chef;

  next();
};

module.exports = {
  checkChefs,
  post,
  put,
};