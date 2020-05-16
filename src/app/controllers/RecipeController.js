const Recipe = require('../models/Recipe');
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

module.exports = {
  async index(req, res) {
    const results = await Recipe.all();
    const filesPromise = results.rows.map(recipe => getRecipeImage(recipe, req));
    const recipes = await Promise.all(filesPromise);

    return res.render('recipe/index', { recipes });
  },

  async create(req, res) {
    const results = await Recipe.ChefSelectionOptions();
    const chefs = results.rows

    return res.render('recipe/create', { chefs });
  },

  async post(req, res) {
    return res.send(req.body);
  },

  async show(req, res) {
    const recipeId = req.params.id;
    let results = await Recipe.findOne(recipeId);
    const recipe = await getRecipeImage(results.rows[0], req);

    results = await Recipe.ChefSelectionOptions();
    const chefs = results.rows

    return res.render('recipe/edit', { recipe, chefs });
  }
}