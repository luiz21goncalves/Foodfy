const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');

module.exports = {
  async indexRecipes(req, res) {
    try {
      const { filter = '' } = req.query;
    
      let results = await Recipe.search(filter);
      const recipes = results.rows;

      results = await RecipeFile.all();
      const recipesFiles = results.rows.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
      }));
      
      return res.render('customers/index', { recipes, filter, recipesFiles });
    } catch (err) {
      throw new Error(err);
    }
  },

  async indexChefs(req, res) {
    try {
      let results = await Chef.all();
      const chefs = results.rows;

      results = await File.all();
      const chefsFiles = results.rows.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
      }));
      
      return res.render('customers/chefs', { chefs, chefsFiles });
    } catch (err) {
      throw new Error(err);
    }
  },

  async showRecipes(req, res) {
    try {
      const recipeId = req.params.id
      let results = await Recipe.find(recipeId);
      const recipe = results.rows[0];
  
      if (!recipe) return res.send('Receita não encontrada!');

      results = await RecipeFile.find(recipeId);
      const recipeFilesPromise = results.rows.map(file => File.find(file.file_id));

      results = await Promise.all(recipeFilesPromise);
      const recipeFilesArray = results.map(results => results.rows[0]);

      const recipeFiles = recipeFilesArray.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
      }));
      
      return res.render('customers/show', { recipe, recipeFiles });
    } catch (err) {
      throw new Error(err);
    }
}
}