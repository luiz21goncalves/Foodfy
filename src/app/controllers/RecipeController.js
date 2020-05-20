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

      const filesId = results.map(result => result.rows[0])
      const recipeFilesPromise = filesId.map(file => RecipeFile.create(file.id, recipeId));
      await Promise.all(recipeFilesPromise);
      
      return res.redirect(`/admin/recipes/${recipeId}`);
    } catch (err) {
      console.error('RecipeController post', err);

      return res.render('recipe/create', { 
        recipe: req.body,
        error: 'Erro inesperado, tente novamente!'
      });
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

      return res.render('recipe/show', { recipe });
    }
  },

  async edit(req, res) {
    try {
      const recipe = await getRecipeImage(req.recipe, req);

      const results = await Recipe.ChefSelectionOptions();
      const chefs = results.rows

      return res.render('recipe/edit', { recipe, chefs })
    } catch(err) {
      console.error('RecipeController edit', err);

      return res.render('recipe/edit', { recipe, chefs });
    }
  },

  async put(req, res) {
    try {
      console.log(req.body)
      const recipeId = req.body.id;

      if (req.body.removed_images) {
        const filesId = req.body.removed_images.split(',');
        const lastIndex = filesId.length - 1;
        filesId.splice(lastIndex, 1);
  
        const recipeFilesDeletePromise = filesId.map(id => RecipeFile.delete(id));
        await Promise.all(recipeFilesDeletePromise);
  
        const filesDeletePromise = filesId.map(id => File.delete(id));
        await Promise.all(filesDeletePromise);
      }
  
      if (req.files != 0) {
        const  filesPormise = req.files.map(file => File.create({ ...file }));
        const results = await Promise.all(filesPormise);
        
        const recipeFiles = results.map(result => result.rows[0]);
        const recipeFilesPromise = recipeFiles.map(file => RecipeFile.create(file.id, recipeId));
        await Promise.all(recipeFilesPromise);
      }
  
      await  Recipe.update(req.body);
  
      return res.redirect(`/admin/recipes/${recipeId}`);
    } catch (err) {
      console.error('RecipeController put', err);

      const results = await Recipe.ChefSelectionOptions();
      const chefs = results.rows

      return res.render('recipe/edit', {
        recipe: req.body,
        chefs,
        error: 'Erro inesperado, tente novamente!'
      });
    }
  },

  async delete(req, res) {
    try {
      const recipe = req.recipe;

      const results = await RecipeFile.find(recipe.id);
  
      const recipeFilesDeletePromise = results.rows.map(item => RecipeFile.delete(item.file_id));
      await Promise.all(recipeFilesDeletePromise);
  
      const filesDeletePromise = results.rows.map(item => File.delete(item.file_id));
      await Promise.all(filesDeletePromise);
  
      await Recipe.delete(recipe.id);
  
      return res.redirect('/admin/recipes');
    } catch  (err) {
      console.error('RecipeController delete', err);

      res.render('recipe/edit', { 
        recipe,
        error: 'Erro inesperado, tente novamente!'
      });
    }
  },
}