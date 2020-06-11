const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');
const LoadChefService = require('../services/LoadChefService');
const LoadRecipeService = require('../services/LoadRecipeService');

async function checkChef(req, res, next) {
  const { id } = req.params;
  const chef = await Chef.findOne({ where: { id } });

  if (!chef) {
    const filters = '';
    const limit = 16;
    const page = 1;

    const { chefs, pagination } = await LoadChefService.paginate({
      limit,
      page,
      filters,
    });

    return res.render('home/chef', {
      chefs,
      pagination,
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
    const filters = '';
    const limit = 6;
    const page = 1;

    const { recipes, pagination } = await LoadRecipeService.paginate({
      limit,
      page,
      filters,
    });

    return res.render('home/index', {
      recipes,
      pagination,
      error: 'Receita não encontrada.',
    });
  }

  req.recipe = recipe;

  next();
}

module.exports = { checkChef, checkRecipe };
