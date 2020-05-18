const Recipe = require('../models/Recipe');
const File = require('../models/File');

function checkAllFields(body) {
  const keys = Object.keys(body);

  for (key of keys) {
    if (body[key] == '' && key != 'removed_images' && key != 'information')
      return {
        recipe: body,
        error: 'Apenas o campo de informações adicionas não é obrigatário.'
      };
  }
}

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
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields)
    return res.render('recipe/create', fillAllFields);

  if (req.files.length == 0)
    return res.render('recipe/create', { 
      recipe: req.body,
      error: 'Envie pelo menos uma imagem.'
    });

  next();
};

async function put(req, res, next) {
  const fillAllFields = checkAllFields(req.body);
    
  const results = await Recipe.ChefSelectionOptions();
  const chefs = results.rows;

  if (fillAllFields)
    return res.render('recipe/edit', {fillAllFields, chefs});

  if (req.files == 0)
    return  res.render('recipe/edit', {
      recipe: req.body,
      chefs,
      error: 'Envie pelo menos uma imaagem'
    });

  next();
};

function search(req, res, next) {
  const { filter } = req.query;

  if (!filter) return res.redirect('/recipes');

  next();
};

module.exports = {
  checkRecipe,
  post,
  put,
  search,
};