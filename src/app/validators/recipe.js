const Recipe = require('../models/Recipe');

function checkAllFields(body) {
  const keys = Object.keys(body);
  
  for (key of keys) {
    if (body[key] == '' && key != 'removed_images' && key != 'information')
      return  {
        recipe: body,
        error :'Apenas o campo de informações adicionais não é obrigatório'
      };
  }
};

async function checkIfRecipeExist(id) {
  const results = await Recipe.find(id);
  const recipe = results.rows[0];

  if (!recipe) return  {
    error: 'Receita não encontrada!'
  }

  return recipe;
}

async function post(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) return res.render('recipes/create', fillAllFields);

  if (req.files.length == 0) return res.render('recipes/create', {
    recipe: req.body,
    error: 'Envie pelo menos uma imagem.'
  });

  next();
};

async function checkRecipe(req, res, next) {
  const checkRecipe = await checkIfRecipeExist(req.params.id);

  if(checkRecipe.error) return res.render('recipes/index', checkRecipe);

  req.recipe = checkRecipe;

  next();
}

module.exports = {
  post,
  checkRecipe,
};