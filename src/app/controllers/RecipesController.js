const Recipe = require('../models/Recipe');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');

module.exports = {
  async index(req ,res) {
    try {
      let results = await Recipe.all();
      let recipes = results.rows;

      async function getRecipeImage(recipe) {
        const results = await RecipeFile.find(recipe.id);
        const files = results.rows.map(file => ({
          ...file,
          src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }))
        
        return { ...recipe, files: files[0] };
      }

      const filesPromise = await results.rows.map(recipe => getRecipeImage(recipe));
      recipes = await Promise.all(filesPromise);

      return res.render('recipes/index', { recipes });
    } catch (err) {
      console.error('RecipeController inde', err);

      return res.render('recipes/index', {
        error: 'Erro inesperado tente novamente!'
      });
    }
  },

  async create(req, res) {
    try {
      const results = await Recipe.chefSelectOptions();
      const chefs = results.rows;
      
      return res.render('recipes/create', { chefs })
    } catch (err) {
      console.error('RecipeController create', err);

      return res.render('recipes/create', {
        chefs,
        error: 'Erro inesperado tente novamente!'
      });
    }
  },

  async post(req ,res) {
    try {
      let results = await Recipe.create(req.body);
      const recipeId =  results.rows[0].id
      
      const filesPromise = req.files.map(file => File.create({ ...file }));
      results = await Promise.all(filesPromise);

      const recipeFiles = results.map(result => result.rows[0]);
      const recipeFilesPromise =  recipeFiles.map(file => RecipeFile.create(file.id, recipeId));
      await Promise.all(recipeFilesPromise);
      
      return res.redirect(`recipes/${recipeId}`);
    } catch (err) {
      console.error( 'RecipeController post', err);

      return res.render('recipes/create', {
        recipe: req.body,
        error: 'Erro inesperado tente novamente!'
      });
    }
  },

  async show(req, res) {
    try {
      let recipe = req.recipe;

      async function getRecipeImage(recipe) {
        const results = await RecipeFile.find(recipe.id);
        const files = results.rows.map(file => ({
          ...file,
          src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }))

        return { ...recipe, files };
      }

      recipe = await getRecipeImage(recipe);
 
      return res.render('recipes/show', { recipe });
    } catch (err) {
      console.error( 'RecipeController show', err);

      return res.render('recipes/show', {
        recipe,
        error: 'Erro inesperado tente novamente!'
      });
    }
  },

  async edit(req, res) {
    try {
      const recipeId = req.params.id;

      let results = await Recipe.find(recipeId);
      let recipe = results.rows[0];

      if (!recipe) return res.render('recipes/index', {
        error: 'Receita não encontrada!'
      });

      results = await Recipe.chefSelectOptions();
      const chefs = results.rows;

      async function getRecipeImage(recipe) {
        const results = await RecipeFile.find(recipe.id)
        const files = results.rows.map(file => ({
          ...file,
          src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }))

        return { ...recipe, files };
      }

      recipe = await getRecipeImage(recipe);

      return res.render('recipes/edit', { recipe, chefs });
    } catch (err) {
      console.error( 'RecipeController edit', err);

      return res.render('recipes/create', {
        recipe,
        chefs,
        error: 'Erro inesperado tente novamente!'
      });
    }
  },

  async put(req, res) {
    const keys = Object.keys(req.body);
    const recipeId = req.body.id;

    for (key of keys) {
      if (req.body[key] == '' && key != 'information' && key != 'removed_images') 
       return res.render('recipes/edit', {
        recipe: req.body,
        error:'Apenas o campo de informações adicionais não é obrigatório'
      });
    }

    try {
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
        const newFilesPromise = req.files.map(file => File.create({ ...file }));
        const results = await Promise.all(newFilesPromise);

        const recipeFiles = results.map(result => result.rows[0]);
        const recipeFilesPromise = recipeFiles.map(file => RecipeFile.create(file.id, recipeId))
        await  Promise.all(recipeFilesPromise);
      }

      await Recipe.update(req.body);

      return res.redirect(`/admin/recipes/${recipeId}`);
    } catch (err) {
      console.error('RecipesController put',err);

      return res.render('recipes/edit', {
        recipe: req.body,
        error:'Erro inesperado tente novamente!'
      });
    }
  },

  async delete(req, res) {
    try {
      const recipeId = req.body.id;

      let results = await Recipe.find(recipeId);
      const recipe = results.rows

      results = await RecipeFile.find(recipeId);

      const recipeFilesDeletePromise = results.rows.map(item => RecipeFile.delete(item.file_id));
      await Promise.all(recipeFilesDeletePromise);

      const fileDeletePromise = results.rows.map(item => File.delete(item.file_id));
      await Promise.all(fileDeletePromise);

      await Recipe.delete(recipeId);
      return res.redirect('/admin/recipes');
    } catch (err) {
      console.error('RecipesController put',err);

      return res.render('recipes/edit', {
        recipe,
        error:'Erro inesperado tente novamente!'
      });
    }
  }
}
