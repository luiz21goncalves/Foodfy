const Recipe = require('../models/Recipe');
const File = require('../models/File');

async function polulateChefSelection() {
  const results = await Recipe.ChefSelectionOptions();

  return results.rows;
};

async function checkAllFields(body) {
  const keys = Object.keys(body);

  for (key of keys) {
    if (body[key] == '' && key != 'removed_images' && key != 'information') {
      const chefs = await polulateChefSelection();

      return {
        chefs,
        recipe: body,
        error: 'Apenas o campo de informações adicionas não é obrigatário.'
      };
    }
  }
};

function checkForImages(files) {
  if (files.length == 0) {

    return {
      error: 'Envie pelo menos uma imagem.'
    }
  }
};

async function getRecipeImage(recipe, req) {
  const results = await File.findByRecipe(recipe.id);
  const files = results.rows.map(file => ({
    ...file,
    src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
  }));
  
  return {
    ...recipe,
    files
  }
};

async function checkRecipe(req, res, next) {
  const results = await Recipe.findOne(req.params.id || req.body.id);
  let recipe = results.rows[0];

  if (!recipe) {
    const results = await Recipe.all();
    const filesPromise = results.rows.map(recipe => getRecipeImage(recipe, req));
    const recipes = await Promise.all(filesPromise);

    return res.render('recipe/index', { 
      recipes,
      error: 'Receita não encontrada.'
     });
  }

  req.recipe = recipe;

  next();
};

async function post(req, res, next) {
  const fillAllFields = await checkAllFields(req.body);

  if (fillAllFields)
    return res.render('recipe/create', fillAllFields);
  
  const thereIsImage = await checkForImages(req.files);

  if (thereIsImage) {
    const chefs = await polulateChefSelection();

    return res.render('recipe/create', { 
      ...thereIsImage,
      chefs,
      recipe: req.body,
    });
  }

  next();
};

async function put(req, res, next) {
  const isAdmin = req.session.isAdmin;
  const userId = req.session.userId;

  const recipe = await getRecipeImage(req.body, req);

  if (!isAdmin || userId != req.body.user_id)
    return res.render('recipe/show', {
      recipe,
      isAdmin,
      userId,
      error: 'Você não tem permissão para editar ou deletar essa receita.'
    });

  const fillAllFields = await checkAllFields(req.body);

  if (fillAllFields)
    return res.render('recipe/edit', {
      ...fillAllFields,
    });

  const thereIsImage = await checkForImages(req.files);

  const removedImages = req.body.removed_images.split(',');
  const lastIndex = removedImages.length - 1;
  removedImages.splice(lastIndex, 1);

  if (thereIsImage && removedImages.length >= recipe.files.length) {
    const chefs = await polulateChefSelection();

    return  res.render('recipe/edit', {
      error: 'Envie pelo menos uma imagem',
      recipe: {...recipe, ...req.body},
      chefs
    });
  }

  next();
};

module.exports = {
  checkRecipe,
  post,
  put,
};