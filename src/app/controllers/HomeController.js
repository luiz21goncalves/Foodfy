const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');

async function getRecipeImage(recipe, req) {
  const results = await RecipeFile.find(recipe.id);
  const files = results.rows.map(file => ({
    ...file,
    src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
  }))

  return { ...recipe, files };
};

async function getChefImage(chef, req) {
  const results = await File.find(chef.file_id);

  const files = results.rows.map(file => ({
    ...file,
    src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
  }));

  return { ...chef, file: files[0] };
};

module.exports = {
  async indexRecipes(req, res) {
    try {
      const results = await Recipe.all();
      let recipes = results.rows.filter((recipe, index) => index > 5 ? false : true);

      const recipesFilesPromise = recipes.map(recipe => getRecipeImage(recipe, req));
      recipes = await Promise.all(recipesFilesPromise);

      return res.render('home/recipes', { recipes });
    } catch (err) {
      console.error('HomeController indexRecieps', err);

      return res.render('home/recipes', { 
        recipes,
        error: 'Error inesperado, tente novamente!'
      });
    }
  },

  async indexChefs(req, res) {
    try {
      let results = await Chef.all();
      let chefs = results.rows;

      const filesPromise = await chefs.map(chef => getChefImage(chef, req));
      chefs = await Promise.all(filesPromise);
      
      return res.render('home/chefs', { chefs });
    } catch (err) {
      console.error('HomeController indexChefs', err);

      return res.render('home/chefs', { 
        chefs,
        error: 'Error inesperado, tente novamente!'
      });
    }
  },

  async showRecipes(req, res) {
    try {
      let recipe = req.recipe;
      recipe = await getRecipeImage(recipe, req);
      
      return res.render('home/show', { recipe });
    } catch (err) {
      console.error('HomeController showRecipes', err);
      
      return res.render('home/show', { 
        recipe,
        error: 'Error inesperado, tente novamente!'
      });
    }
  },

  async showChef(req, res) {
    try {
      let chef = req.chef;
      chef = await getChefImage(chef, req);
  
      let results = await Chef.findRecipesByChef(chefId);
      let recipes = results.rows;

      const recipesFilesPromise = recipes.map(recipe => getRecipeImage(recipe, req));
      recipes = await Promise.all(recipesFilesPromise);
   
      return res.render('home/chef-recipes', { chef, recipes });
    } catch (err) {
      console.error('HomeController showChef', err);

      return res.render('home/chef-recipes', {
        chef,
        recipes,
        error: 'Error inesperado, tente novamente!'
      });
    }
  },

  async search (req, res) {
    try {
      const filter = req.filter;
        
      const results = await Recipe.search(filter);
      let recipes = results.rows;

      const recipesFilesPromise = results.rows.map(recipe => getRecipeImage(recipe, req));
      recipes = await Promise.all(recipesFilesPromise);
  
      return res.render('search/index', { filter, recipes });
    } catch (err) {
      console.error('HomeController', err);

      return res.render('search/index', {
        filter,
        recipes,
        error: 'Error inesperado, tente novamente!'
      });
    }
  },

}