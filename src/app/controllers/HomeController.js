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
  async recipes(req, res) {
    const results = await Recipe.find();
    let recipes = results.rows;

    const filesPromiese = recipes.map(recipe => getRecipeImage(recipe, req));
    recipes = await Promise.all(filesPromiese);

    return res.render('home/index', { recipes });
  },

  about(req, res) {
    return res.render('home/about');
  },

  async chefs(req, res) {
    
  }
};