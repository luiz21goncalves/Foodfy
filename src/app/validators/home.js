const Chef = require('../models/Chef');
const File = require('../models/File');
const Recipe = require('../models/Recipe');

async function getChefImage(chef, req) {
  const results = await File.findOne(chef.file_id);
  const files = results.rows.map(file => ({
    ...file,
    src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
  }));
  
  return {
    ...chef,
    files
  }
};

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

async function checkChef(req, res, next) {
  const results = await Chef.findOne(req.params.id);
  const chef = results.rows[0];

  if (!chef) {
    const results = await Chef.all();
    const filesPromise = results.rows.map(chef => getChefImage(chef, req));
    const chefs = await Promise.all(filesPromise);

    return res.render('home/chef', {
      chefs,
      error: 'Chef não encontrado.'
    });
  }

  req.chef = chef;

  next();
};

async function checkRecipe(req, res, next) {
  const results = await Recipe.findOne(req.params.id);
  const recipe = results.rows[0];

  if (!recipe) {
    const results = await Recipe.all();
    const filesPromise = results.rows.map(recipe => getRecipeImage(recipe, req));
    const recipes = await Promise.all(filesPromise);

    return res.render('home/index', {
      recipes,
      error: 'Receita não encontrada.'
    });
  }

  next();
};

function search(req, res, next) {
  const { filter } = req.query;

  if (!filter) return res.redirect('/recipes');

  next();
};


module.exports = {
  checkChef,
  checkRecipe,
  search,
};