const Recipe = require('../models/Recipe');
const LoadChefService = require('../services/LoadChefService');
const LoadRecipeService = require('../services/LoadRecipeService');

module.exports = {
  async index(req, res) {
    const recipes = await LoadRecipeService.load('recipes');

    return res.render('home/index', { recipes });
  },

  async recipe(req, res) {
    let { recipe } = req;
    recipe = await LoadRecipeService.format(recipe);

    return res.render('home/recipe', { recipe });
  },

  async search(req, res) {
    const { filter } = req.query;
    let recipes = await Recipe.search(filter);
    recipes = await Promise.all(
      recipes.map((recipe) => LoadRecipeService.format(recipe))
    );

    return res.render('home/search', { filter, recipes });
  },

  async chefs(req, res) {
    const chefs = await LoadChefService.load('chefs');

    return res.render('home/chef', { chefs });
  },

  async chefShow(req, res) {
    let { chef } = req;
    chef = await LoadChefService.format(chef);

    const recipes = await LoadRecipeService.load('recipes', {
      where: { chef_id: chef.id },
    });

    return res.render('home/recipes-chefs', { chef, recipes });
  },

  about(req, res) {
    return res.render('home/about');
  },
};
