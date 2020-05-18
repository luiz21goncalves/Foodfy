const Recipe = require('../models/Recipe');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');

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
    try {
      const results = await Recipe.all();
      const filesPromise = results.rows.map(recipe => getRecipeImage(recipe, req));
      const recipes = await Promise.all(filesPromise);

      return res.render('recipe/index', { recipes });
    } catch(err) {
      console.error('RecipeController index', err);

      return res.render('recipe/index', { recipes });
    }
  },

  async create(req, res) {
    try {
      const results = await Recipe.ChefSelectionOptions();
      const chefs = results.rows
  
      return res.render('recipe/create', { chefs });
    } catch (err) {
      console.error('RecipeController create', err);

      return res.render('recipe/edit', { chefs });
    }
  },

  async post(req, res) {
    try {
      let results = await Recipe.create(req.body);
      const recipeId = results.rows[0].id;

      const filesPromise = req.files.map(file => File.create({ ...file }));
      results = await Promise.all(filesPromise);

      const recipeFilesId = results.map(result => result.rows[0])
      const recipeFilesPromise = recipeFilesId.map(file => RecipeFile.create(file.id, recipeId));
      await Promise.all(recipeFilesPromise);
      
      return res.redirect(`recipes/${recipeId}`);
    } catch (err) {
      console.error('RecipeController post', err);

      return res.render('recipe/create', { recipe: req.body });
    }
  },

  async show(req, res) {
    try {
      const recipeId = req.params.id;
      let results = await Recipe.findOne(recipeId);
      const recipe = await getRecipeImage(results.rows[0], req);
  
      return res.render('recipe/show', { recipe });
    } catch (err) {
      console.error('RecipeController show', err);

      return res.render('recipe/edit', { recipe });
    }
  },

  async edit(req, res) {
    try {
      const recipe = await getRecipeImage(req.recipe, req);

      const results = await Recipe.ChefSelectionOptions();
      const chefs = results.rows

      return res.render('recipe/edit', { recipe, chefs })
    } catch(err) {
      console.log('RecipeController edit', err);

      return res.render('recipe/edit', { recipe, chefs });
    }
  },
}