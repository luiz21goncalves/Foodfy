const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');

module.exports = {
  async indexRecipes(req, res) {
    try {
      const results = await Recipe.all();
      const recipes = results.rows.filter((recipe, index) => index > 5 ? false : true);

      async function getImage(recipeId) {
        const results = await RecipeFile.find(recipeId);
        const files = results.rows.map(file => ({
          ...file,
          src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }))

        return files[0]
      }

      const recipesFilesPromise = results.rows.map(recipe => getImage(recipe.id));
      const recipesFiles = await Promise.all(recipesFilesPromise);
      
      return res.render('home/index', { recipes, recipesFiles });
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

      async function getImage(recipeId) {
        const results = await RecipeFile.find(recipeId);
        const files = results.rows.map(file => ({
          ...file,
          src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,  
        }))

        return files
      }

      const recipeFilesPromise = await getImage(recipeId);
      const recipeFiles = await Promise.all(recipeFilesPromise);
      
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

      async function getImage(recipeId) {
        const results = await RecipeFile.find(recipeId);
        const files = results.rows.map(file => ({
          ...file,
          src: `${req.protocol}://${req.headers.host}${file.path.replace('public','')}`  
        }));

        return files[0];
      }

      const recipesFilesPromise = recipes.map(recipe => getImage(recipe.id));
      const recipesFiles = await Promise.all(recipesFilesPromise);
   
      return res.render('home/recipes-chef', { chef, recipes, chefFile, recipesFiles });
    } catch (err) {
      throw new Error(err);
    }
  },

  async search (req, res) {
    try {
      const { filter } = req.query;

      if (!filter || filter == '') return res.redirect('/recipes')
  
      const results = await Recipe.search(filter);
      const recipes = results.rows;

      async function getImage(recipeId) {
        const results = await RecipeFile.find(recipeId);
        const files = results.rows.map(file => ({
          ...file,
          src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }))

        return files[0];
      }

      const recipesFilesPromise = results.rows.map(recipe => getImage(recipe.id));
      const recipesFiles = await Promise.all(recipesFilesPromise);
  
      return res.render('search/index', { filter, recipes, recipesFiles });
    } catch (err) {
      console.error('HomeController', err);
    }
  },

  showAbout (req, res) {
    return res.render("home/about");
  },

  redirect (req, res) {
    return res.redirect('/recipes');
  }
}