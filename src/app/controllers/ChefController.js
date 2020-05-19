const Chef = require('../models/Chef');
const File = require('../models/File');


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

async function getChefImage(chef, req) {
  const results = await File.findOne(chef.id);
  const files = results.rows.map(file => ({
    ...file,
    src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
  }));
  
  return {
    ...chef,
    files
  }
};

module.exports = {
  async index(req, res) {
    try {
      const results = await Chef.all();
      let chefs = results.rows;
  
      const filesPromise = chefs.map(chef => getChefImage(chef, req));
      chefs = await Promise.all(filesPromise);
  
      return res.render('chef/index', { chefs });
    } catch (err) {
      console.error('ChefsController index', err);

      return res.render('chef/index', { chefs });
    }
  },

  async show(req, res) {
    const chef = await getChefImage(req.chef, req);

    const results = await Chef.findRecipeByChef(chef.id);
    const recipesFilesPromise = results.rows.map(recipe => getRecipeImage(recipe, req));
    const recipes = await Promise.all(recipesFilesPromise);

    return res.render('chef/show', { chef, recipes });
  },

  async edit(req, res) {
    const chef = await getChefImage(req.chef, req);
    return res.render('chef/edit', { chef });
  }
};
