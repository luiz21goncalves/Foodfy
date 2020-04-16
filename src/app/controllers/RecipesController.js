const Recipe = require('../models/Recipe');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');

module.exports = {
  async index(req ,res) {
    const results = await Recipe.all();
    const recipes = results.rows;
   
    return res.render('recipes/index', { recipes });
  },

  async create(req, res) {  
    const results = await Recipe.chefSelectOptions();
    const chefs = results.rows;
    
    return res.render('recipes/create', { chefs })
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
    
    let results = await Recipe.create(req.body);
    const recipeId =  results.rows[0].id
    
    const filePromise = req.files.map(file => File.create({ ...file }));
    results = await Promise.all(filePromise);

    console.log(results)
    
    // results = await RecipeFile.create({fileId, recipeId})
    
    return res.redirect(`recipes/${recipeId}`);
  },

  async show(req, res) {
    const results = await Recipe.find(req.params.id);
    const recipe = results.rows[0];

    if (!recipe) return res.send('Receita não encontrada.');
    
    return res.render('recipes/show', { recipe });
  },

  async edit(req, res) {
    let results = await Recipe.find(req.params.id);
    const recipe = results.rows[0];

    if (!recipe) return res.send('Receita não encontrada.');

    results = await Recipe.chefSelectOptions();
    const chefs = results.rows;

    return res.render('recipes/edit', { recipe, chefs })
  },

  async put(req, res) {
    const keys = Object.keys(req.body);
  
    for (key of keys) {
      if (req.body[key] != '' || req.body.information == '') 
       return res.send('Apenas o campo de informações adicionais não é obrigatório');
    }
    
    await Recipe.update(req.body);

    return res.redirect(`/admin/recipes/${req.body.id}`);
  },

  async delete(req, res) {
    await Recipe.delete(req.body.id);

    return res.redirect('/admin/recipes');  
  }
}
