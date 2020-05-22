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

module.exports = {
  async index(req, res) {
    try {
      const isAdmin = req.session.isAdmin;

      const results = await Chef.all();
      let chefs = results.rows;
  
      const filesPromise = chefs.map(chef => getChefImage(chef, req));
      chefs = await Promise.all(filesPromise);
  
      return res.render('chef/index', { chefs, isAdmin });
    } catch (err) {
      console.error('ChefsController index', err);

      return res.render('chef/index', { chefs, isAdmin });
    }
  },

  create(req, res) {
    return res.render('chef/create');
  },

  async show(req, res) {
    const isAdmin = req.session.isAdmin;
    
    const chef = await getChefImage(req.chef, req);

    const results = await Chef.findRecipeByChef(chef.id);
    const recipesFilesPromise = results.rows.map(recipe => getRecipeImage(recipe, req));
    const recipes = await Promise.all(recipesFilesPromise);

    return res.render('chef/show', { chef, recipes, isAdmin });
  },
  
  async post(req, res) {
    try {
      const { name } = req.body

      let results = await  File.create(...req.files);
      const fileId = results.rows[0].id
      
      results = await Chef.create(name, fileId)
      const chefId = results.rows[0].id

      results = await Chef.findOne(chefId);
      const chef = await getChefImage(results.rows[0], req);

      return res.render('chef/show', {
        chef,
        success: `O chef ${chef.name} foi criado com sucesso.`
      });
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
      let { id: chefId, file_id: fileId } = req.chef;

      let data = { ...req.body, fileId };

      if (req.files && removedImges) {
        const results = await File.create(...req.files);
        const { id } = results.rows[0];

        data = { ...data, fileId: id };
      }

      await Chef.update(data);

      if (removedImges) 
        await File.delete(removedImges);
      
      results = await Chef.findOne(chefId);
      const chef = await getChefImage(results.rows[0], req);

      results = await Chef.findRecipeByChef(chefId);
      const recipesFilesPromise = results.rows.map(recipe => getRecipeImage(recipe, req));
      const recipes = await Promise.all(recipesFilesPromise);

      return res.render('chef/show', {
        chef,
        recipes,
        success: `O chef ${chef.name} foi atualizado com sucesso.`
      });
    } catch (err) {
      console.error('ChefController put', err);

      return res.render('chef/edit', {
        error: 'Erro inesperado, tente novamanete.',
        chef: req.body
      })
    }
  },

  async delete(req, res) {
    try {
      const chef = req.chef;

      const results = await Chef.findRecipeByChef(chef.id);
      const recipes =  results.rows;
  
      if (recipes.length == 0) {
        await Chef.delete(chef.id);
        await File.delete(chef.file_id);

        const results = await Chef.all();
        const filesPromise = results.rows.map(chef => getChefImage(chef, req));
        const chefs = await Promise.all(filesPromise);
  
        return res.render('chef/index', {
          chefs,
          success: `o chef ${chef.name} deletado com sucesso.`
        });
      }

      chef = await getChefImage(chef, req);

      return res.render('chef/edit', {
        chef,
        error: 'Esse chef não pode ser deletado, pois possui pelo menos receita cadastrada!'
      })
    } catch (err) {
      console.error('ChefController delete', err);

      return res.render('chef/edit', {
        chef,
        error: 'Erro inesperado, tente novamente.'
      })
    }
  },
};
