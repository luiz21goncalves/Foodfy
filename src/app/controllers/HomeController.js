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

      const recipesFilesPromise = results.rows.map(recipe => RecipeFile.findByRecipeId(recipe.id));
      results = await Promise.all(recipesFilesPromise);

      const recipesFilesInfo = results.map(result => result.rows[0])

      const recipeFilesPromise = recipesFilesInfo.map(fileInfo => File.find(fileInfo.file_id));
      results = await Promise.all(recipeFilesPromise);

      let recipesFiles = results.map(result => result.rows[0]);
      recipesFiles = recipesFiles.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
      }));
      
      return res.render('home/index', { recipes, filter, recipesFilesInfo, recipesFiles });
    } catch (err) {
      throw new Error(err);
    }
  },

  async indexChefs(req, res) {
    try {
      let results = await Chef.all();
      const chefs = results.rows;

      const chefsFilesPromise = await chefs.map(chef => File.find(chef.file_id));
      results = await Promise.all(chefsFilesPromise);

      let chefsFiles = results.map(result => result.rows[0]);
      chefsFiles = chefsFiles.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
      }));
      
      return res.render('home/chefs', { chefs, chefsFiles });
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

      results = await RecipeFile.findByRecipeId(recipeId);
      const recipeFilesPromise = results.rows.map(file => File.find(file.file_id));

      results = await Promise.all(recipeFilesPromise);
      const recipeFilesArray = results.map(results => results.rows[0]);

      const recipeFiles = recipeFilesArray.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
      }));
      
      return res.render('home/show', { recipe, recipeFiles });
    } catch (err) {
      throw new Error(err);
    }
  },

  async showChef(req, res) {
    try {
      const chefId = req.params.id;

      let results = await Chef.find(chefId);
      const chef = results.rows[0];
  
      if (!chef) return res.send('Chef não encontrado!');
  
      results = await Chef.findRecipesByChef(chefId);
      const recipes = results.rows;

      results = await File.find(chef.file_id);
      let chefFile = results.rows[0];
      chefFile = {
        ...chefFile,
        src: `${req.protocol}://${req.headers.host}${chefFile.path.replace('public', '')}`,
      };

      const recipesFilesInfoPromise = recipes.map(recipe => RecipeFile.findByRecipeId(recipe.id));
      results = await Promise.all(recipesFilesInfoPromise);

      const recipesFilesInfo = results.map(result => result.rows[0]);

      const recipesFilesPromise = recipesFilesInfo.map(info => File.find(info.file_id));
      results = await Promise.all(recipesFilesPromise);

      let recipesFiles = results.map(result => result.rows[0]);
      recipesFiles = recipesFiles.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public','')}`
      }));
      
      return res.render('home/recipes-chef', { chef, recipes, chefFile, recipesFilesInfo, recipesFiles });
    } catch (err) {
      throw new Error(err);
    }
  },

  showAbout (req, res) {
    return res.render("home/about");
  },

  redirect (req, res) {
    return res.redirect('/recipes');
  }
}