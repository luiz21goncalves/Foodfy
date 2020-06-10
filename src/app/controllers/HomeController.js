const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');
const LoadChefService = require('../services/LoadChefService');
const LoadRecipeService = require('../services/LoadRecipeService');

module.exports = {
  async index(req, res) {
    let { limit, page, filter } = req.query;
    filter = filter || '';
    limit = limit || 6;
    page = page || 1;
    const offset = Math.ceil(limit * (page - 1));

    const recipes = await Recipe.paginate({ filter, limit, offset });

    const recipesFormated = await Promise.all(
      recipes.map(LoadRecipeService.format)
    );

    const count = await Recipe.count();

    const pagination = { total: Math.ceil(count / limit), page };

    return res.render('home/index', { recipes: recipesFormated, pagination });
  },

  async recipe(req, res) {
    let { recipe } = req;
    recipe = await LoadRecipeService.format(recipe);

    return res.render('home/recipe', { recipe });
  },

  async search(req, res) {
    let { filter, limit, page } = req.query;
    limit = limit || 6;
    page = page || 1;
    const offset = Math.ceil(limit * (page - 1));

    const recipes = await Recipe.search({ filter, limit, offset });

    const recipesFormated = await Promise.all(
      recipes.map((recipe) => LoadRecipeService.format(recipe))
    );

    const count = await Recipe.countSearch(filter);

    const pagination = { total: Math.ceil(count / limit), page };

    return res.render('home/search', {
      filter,
      recipes: recipesFormated,
      pagination,
    });
  },

  async chefs(req, res) {
    let { limit, page } = req.query;
    const filters = '';
    limit = limit || 16;
    page = page || 1;
    const offset = Math.ceil(limit * (page - 1));

    const chefs = await Chef.paginate({ filters, limit, offset });

    const chefsFormated = await Promise.all(chefs.map(LoadChefService.format));

    const count = Chef.count();

    const pagination = { total: Math.ceil(count / limit), page };

    return res.render('home/chef', { chefs: chefsFormated, pagination });
  },

  async chefShow(req, res) {
    let { chef } = req;
    let { limit, page } = req.query;

    const filters = { where: { chef_id: chef.id } };
    limit = limit || 6;
    page = page || 1;
    const offset = Math.ceil(limit * (page - 1));

    chef = await LoadChefService.format(chef);

    const recipes = await Recipe.paginate({ filters, limit, offset });

    const recipesFormated = await Promise.all(
      recipes.map(LoadRecipeService.format)
    );

    const count = Recipe.count(filters);

    const pagination = { total: Math.ceil(count / limit), page };

    return res.render('home/recipes-chefs', {
      chef,
      recipes: recipesFormated,
      pagination,
    });
  },

  about(req, res) {
    return res.render('home/about');
  },
};
