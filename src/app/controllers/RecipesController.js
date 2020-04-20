const Recipe = require('../models/Recipe');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');

module.exports = {
  async index(req ,res) {
    try {
      const results = await Recipe.all();
      const recipes = results.rows;
      
      return res.render('recipes/index', { recipes });
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
      if (req.body[key] != '' || req.body.information == '') {
      } else {
        return res.send('Apenas o campo de informações adicionais não é obrigatório')
      }
    }

    if (req.files.length == 0)
      return res.send('Envie pelo menos uma imagem.')
    
    try {
      let results = await Recipe.create(req.body);
      const recipeId =  results.rows[0].id
      
      const filesPromise = req.files.map(file => File.create({ ...file }));
      results = await Promise.all(filesPromise);

      const filesId = results.map(result => result.rows[0]);
      const recipeFilePromise =  filesId.map(fileId => RecipeFile.create(fileId.id, recipeId));
      await Promise.all(recipeFilePromise);
      
      return res.redirect(`recipes/${recipeId}`);
    } catch (err) {
      throw new Error(err);
    }
  },

  async show(req, res) {
    try {
      const results = await Recipe.find(req.params.id);
      const recipe = results.rows[0];

      if (!recipe) return res.send('Receita não encontrada.');
      
      return res.render('recipes/show', { recipe });
    } catch (err) {
      throw new Error(err);
    }
  },

  async edit(req, res) {
    try {
      let results = await Recipe.find(req.params.id);
      const recipe = results.rows[0];

      if (!recipe) return res.send('Receita não encontrada.');

      results = await Recipe.chefSelectOptions();
      const chefs = results.rows;

      return res.render('recipes/edit', { recipe, chefs });
    } catch (err) {
      throw new Error(err);
    }
  },

  async put(req, res) {
    const keys = Object.keys(req.body);
  
    for (key of keys) {
      if (req.body[key] != '' || req.body.information == '') 
       return res.send('Apenas o campo de informações adicionais não é obrigatório');
    }
    
    try {
      await Recipe.update(req.body);

     return res.redirect(`/admin/recipes/${req.body.id}`);
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
