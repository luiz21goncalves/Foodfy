const Recipe = require('../models/Recipe');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');

module.exports = {
  async index(req ,res) {
    try {
      let results = await Recipe.all();
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

      return res.render('recipes/index', { recipes, recipesFilesInfo, recipesFiles });
    } catch (err) {
      throw new Error(err);
    }
  },

  async create(req, res) {
    try {
      const results = await Recipe.chefSelectOptions();
      const chefs = results.rows;
      
      return res.render('recipes/create', { chefs })
    } catch (err) {
      throw new Error(err);
    }
  },

  async post(req ,res) {
    const keys = Object.keys(req.body);
  
    for (key of keys) {
      if (req.body[key] == '' && key != 'removed_images' && key != 'information')
        return res.send('Apenas o campo de informações adicionais não é obrigatório')
    }

    if (req.files.length == 0)
      return res.send('Envie pelo menos uma imagem.')
    
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
      throw new Error(err);
    }
  },

  async show(req, res) {
    try {
      const recipeId = req.params.id;

      let results = await Recipe.find(recipeId);
      const recipe = results.rows[0];

      if (!recipe) return res.send('Receita não encontrada.');

      results = await RecipeFile.findByRecipeId(recipeId);
      const recipeFilesPromise = results.rows.map(file => File.find(file.file_id));
      results = await Promise.all(recipeFilesPromise);

      let recipeFiles = results.map(result => result.rows[0]);
      recipeFiles = recipeFiles.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
      }));

      return res.render('recipes/show', { recipe, recipeFiles });
    } catch (err) {
      throw new Error(err);
    }
  },

  async edit(req, res) {
    try {
      const recipeId = req.params.id;

      let results = await Recipe.find(recipeId);
      const recipe = results.rows[0];

      if (!recipe) return res.send('Receita não encontrada.');

      results = await Recipe.chefSelectOptions();
      const chefs = results.rows;

      results = await RecipeFile.findByRecipeId(recipeId);
      const recipeFilesPromise = results.rows.map(file => File.find(file.file_id));
      results = await Promise.all(recipeFilesPromise);

      let recipeFiles = results.map(result => result.rows[0]);
      recipeFiles = recipeFiles.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
      }));

      return res.render('recipes/edit', { recipe, chefs, recipeFiles });
    } catch (err) {
      throw new Error(err);
    }
  },

  async put(req, res) {
    const keys = Object.keys(req.body);
    const recipeId = req.body.id;
  
    for (key of keys) {
      if (req.body[key] == '' && key != 'information' && key != 'removed_images') 
       return res.send('Apenas o campo de informações adicionais não é obrigatório');
    }

    if (req.body.removed_images) {
      try {
        const filesId = req.body.removed_images.split(',');
        const lastIndex = filesId.length - 1;
        filesId.splice(lastIndex, 1);

        try {
          const recipeFilesDeletePromise = filesId.map(id => RecipeFile.delete(id));
          await Promise.all(recipeFilesDeletePromise);
        } catch (err) {
          return console.log(err)
        }
     
        try {
          const filesDeletePromise = filesId.map(id => File.delete(id));
          await Promise.all(filesDeletePromise);
        } catch (err) {
          return console.log(err);
        }


      } catch (err) {
        throw new Error(err);
      }
    }

    if (req.files != 0) {
      try {
        const newFilesPromise = req.files.map(file => File.create({ ...file }));
        const results = await Promise.all(newFilesPromise);
  
        const recipeFiles = results.map(result => result.rows[0]);
        const recipeFilesPromise = recipeFiles.map(file => RecipeFile.create(file.id, recipeId))
        await  Promise.all(recipeFilesPromise);
      } catch (err) {
        throw new Error(err);
      }
    }
    
    try {
      await Recipe.update(req.body);

      return res.redirect(`/admin/recipes/${recipeId}`);
    } catch (err) {
      throw new Error(err);
    }
  },

  async delete(req, res) {
    try {
      await Recipe.delete(req.body.id);

      return res.redirect('/admin/recipes');
    } catch (err) {
      throw new Error(err);
    }
  }
}
