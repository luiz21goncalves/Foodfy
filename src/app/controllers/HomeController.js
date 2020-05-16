const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');
const File = require('../models/File');

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

async function getChefImage(chef, req) {
  const results = await File.findOne(chef.id);
  const files = results.rows.map(file => ({
    ...file,
    src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
  }));
  
  return {
    ...chef,
    files
  }
};

module.exports = {
  async index(req, res) {
    const results = await Recipe.all();
    let recipes = results.rows;

    const filesPromiese = recipes.map(recipe => getRecipeImage(recipe, req));
    recipes = await Promise.all(filesPromiese);

    return res.render('home/index', { recipes });
  },

  async recipe(req, res) {
    const recipeId = req.params.id;
    let recipe = await Recipe.findOne(recipeId);

    recipe = await getRecipeImage(recipe, req);

    return res.render('home/recipe', {recipe});
  },

  async chefs(req, res) {
    const results = await Chef.all();
    let chefs = results.rows;

    const filesPromiese = chefs.map(chef => getChefImage(chef, req));
    chefs = await Promise.all(filesPromiese);

    return res.render('home/chef', {chefs});
  },

  async chefShow(req, res) {
    
  },

  about(req, res) {
    return res.render('home/about');
  },
};