const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');


async function checkIfChefExists(id) {
  const results = await Chef.find(id);
  const chef = results.rows[0];

  if (!chef) return {
    error:'Chef não encontrado!'
  };

  return chef;
};

async function checkIfRecipeExist(id) {
  const results = await Recipe.find(id);
  const recipe = results.rows[0];

  if (!recipe) return  {
    error: 'Receita não encontrada!'
  }

  return recipe;
};

async function checkChef(req, res, next) {
  const checkChef = await checkIfChefExists(req.params.id || req.body.id);

  if(checkChef.error) return res.render('chefs/index', checkChef);

  req.chef = checkChef;

  next();
};

async function checkRecipe(req, res, next) {
  const checkRecipe = await checkIfRecipeExist(req.params.id);

  if(checkRecipe.error) return res.render('recipes/index', checkRecipe);

  req.recipe = checkRecipe;

  next();
};

function search(req, res, next) {
  const { filter } = req.query;

  if (!filter || filter == '') return res.redirect('/recipes');

  req.filter = filter;

  next();
}

module.exports = {
  checkChef,
  checkRecipe,
  search,
};
