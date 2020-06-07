const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');
const LoadChefService = require('../services/LoadChefService');
const LoadRecipeService = require('../services/LoadRecipeService');

async function checkChef(req, res, next) {
  const { id } = req.params;
  const chef = await Chef.findOne({ where: { id } });

  if (!chef) {
    const chefs = await LoadChefService.load('chefs');

    return res.render('home/chef', {
      chefs,
      error: 'Chef não encontrado.',
    });
  }

  req.chef = chef;

  next();
}

async function checkRecipe(req, res, next) {
  const { id } = req.params;
  const recipe = await Recipe.findOne({ where: { id } });

  if (!recipe) {
    const recipes = await LoadRecipeService.load('recipes');

    return res.render('home/index', {
      recipes,
      error: 'Receita não encontrada.',
    });
  }

  req.recipe = recipe;

  next();
}

function search(req, res, next) {
  const { filter } = req.query;

  if (!filter) return res.redirect('/recipes');

  next();
}

module.exports = {
  checkChef,
  checkRecipe,
  search,
};
