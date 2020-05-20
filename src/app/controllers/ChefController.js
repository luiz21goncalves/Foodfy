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

  create(req, res) {
    return res.render('chef/create');
  },

  async show(req, res) {
    const chef = await getChefImage(req.chef, req);

    const results = await Chef.findRecipeByChef(chef.id);
    const recipesFilesPromise = results.rows.map(recipe => getRecipeImage(recipe, req));
    const recipes = await Promise.all(recipesFilesPromise);

    return res.render('chef/show', { chef, recipes });
  },
  
  async post(req, res) {
    try {
      const { name } = req.body

      let results = await  File.create(...req.files);
      const fileId = results.rows[0].id
      
      results = await Chef.create(name, fileId)
      const chefId = results.rows[0].id

      return res.redirect(`/admin/chefs/${chefId}`)
    } catch (err) {
      console.error('ChefController post', err);

      return res.render('chef/create', {
        chef: req.body,
        error: 'Erro inesperado, tente novamente.'
      });
    }
  },

  async edit(req, res) {
    const chef = await getChefImage(req.chef, req);
    return res.render('chef/edit', { chef });
  },

  async put(req, res) {
    try {
      const removedImges = req.body.removed_images;
      const chefId = req.body.id;

      let data = { ...req.body, fileId: removedImges };

      if (req.files) {
        const results = await File.create(...req.files);
        const { id } = results.rows[0];

        data = { ...data, fileId: id };
      }

      console.log(data)

      await Chef.update(data);

      if (removedImges) 
        await File.delete(removedImges);

      return res.redirect(`/admin/chefs/${chefId}`);
    } catch (err) {
      console.error('ChefController put', err);

      return res.render('chef/edit', {
        chef: req.body
      })
    }
  },
};
