const Recipe = require('../models/Recipe');

async function checkRecipe(req, res, next) {
  const recipeId = req.params.id;
  const recipe = await Recipe.findOne(recipeId);
  console.log(recipe)
  
  if (!recipe) return res.render('home/recipe', {
    error: 'Receita não encontrada!'
  });

  next();
};

function search(req, res, next) {
  const { filter } = req.query;

  if (!filter) return res.redirect('/recipes');

  next();
};

module.exports = {
  checkRecipe,
  search,
};