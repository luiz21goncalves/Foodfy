const Recipe = require('../models/Recipe');

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

async function checkRecipeExist(id) {
  const results = await Recipe.findOne(id);
  const recipe = results.rows[0];

  if (!recipe) return {
    error: 'Receita não encontrada!'
  }

  return recipe;
}

async function checkRecipe(req, res, next) {
  const recipe = await checkRecipeExist(req.params.id);
  
  if (!recipe)
    return res.render('home/recipe', recipe);

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
}

function search(req, res, next) {
  const { filter } = req.query;

  if (!filter) return res.redirect('/recipes');

  next();
};

module.exports = {
  checkRecipe,
  post,
  search,
};