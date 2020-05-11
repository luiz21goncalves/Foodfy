const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');

module.exports = {
  async indexRecipes(req, res) {
    try {
      const results = await Recipe.all();
      let recipes = results.rows.filter((recipe, index) => index > 5 ? false : true);

      async function getRecipeImage(recipe) {
        const results = await RecipeFile.find(recipe.id);
        const files = results.rows.map(file => ({
          ...file,
          src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }))

        return { ...recipe, files: files[0] };
      }

      const recipesFilesPromise = recipes.map(recipe => getRecipeImage(recipe));
      recipes = await Promise.all(recipesFilesPromise);
      console.log(recipes)

      return res.render('home/recipes', { recipes });
    } catch (err) {
      throw new Error(err);
    }
  },

  async indexChefs(req, res) {
    try {
      let results = await Chef.all();
      let chefs = results.rows;

      async function getChefImage(chef) {
        const results = await File.find(chef.file_id);

        const files = results.rows.map(file => ({
          ...file,
          src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
        }));

        return { ...chef, file: files[0] };
      }

      const filesPromise = await chefs.map(chef => getChefImage(chef));
      chefs = await Promise.all(filesPromise);
      
      return res.render('home/chefs', { chefs });
    } catch (err) {
      throw new Error(err);
    }
  },

  async showRecipes(req, res) {
    try {
      const recipeId = req.params.id

      let results = await Recipe.find(recipeId);
      let recipe = results.rows[0];
  
      if (!recipe) return res.send('Receita não encontrada!');

      async function getRecipeImage(recipe) {
        const results = await RecipeFile.find(recipe.id);
        const files = results.rows.map(file => ({
          ...file,
          src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,  
        }))

        return { ...recipe, files };
      }

      recipe = await getRecipeImage(recipe);
      
      return res.render('home/show', { recipe });
    } catch (err) {
      throw new Error(err);
    }
  },

  async showChef(req, res) {
    try {
      const chefId = req.params.id;

      let results = await Chef.find(chefId);
      let chef = results.rows[0];
  
      if (!chef) return res.send('Chef não encontrado!');

      async function getChefImage(chef) {
        const results = await File.find(chef.file_id);

        const files = results.rows.map(file => ({
          ...file,
          src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
        }));

        return { ...chef, file: files[0] };
      }

      chef = await getChefImage(chef);
  
      results = await Chef.findRecipesByChef(chefId);
      let recipes = results.rows;

      async function getRecipeImage(recipe) {
        const results = await RecipeFile.find(recipe.id);
        const files = results.rows.map(file => ({
          ...file,
          src: `${req.protocol}://${req.headers.host}${file.path.replace('public','')}`  
        }));

        return { ...recipe, files: files[0] };
      }

      const recipesFilesPromise = recipes.map(recipe => getRecipeImage(recipe));
      recipes = await Promise.all(recipesFilesPromise);
   
      return res.render('home/chef-recipes', { chef, recipes });
    } catch (err) {
      throw new Error(err);
    }
  },

  async search (req, res) {
    try {
      const { filter } = req.query;

      if (!filter || filter == '') return res.redirect('/recipes')
  
      const results = await Recipe.search(filter);
      let recipes = results.rows;

      async function getRecipeImage(recipe) {
        const results = await RecipeFile.find(recipe.id);
        const files = results.rows.map(file => ({
          ...file,
          src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }))

        return { ...recipe, files: files[0] };
      }

      const recipesFilesPromise = results.rows.map(recipe => getRecipeImage(recipe));
      recipes = await Promise.all(recipesFilesPromise);
  
      return res.render('search/index', { filter, recipes });
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