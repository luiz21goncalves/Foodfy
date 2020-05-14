const Chef = require ('../models/Chef');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');

async function getChefImage(chef, req) {
  const results = await File.find(chef.file_id);

  const files = results.rows.map(file => ({
    ...file,
    src: `${req.protocol}://${req.headers.host}${file.path.replace('public','')}`
  }));

  return { ...chef, file: files[0] };
};

module.exports = {
  async index(req, res) {
    try {
      let results = await Chef.all();
      let chefs = results.rows;

      req.chefs = chefs;

      const filesPromise = await chefs.map(chef => getChefImage(chef, req));
      chefs = await Promise.all(filesPromise);
      
      return res.render('chefs/index', { chefs });
    } catch (err) {
      console.error('ChefsController index',err);

      return res.render('chefs/index', { 
        chefs, 
        error: 'Erro inisperado, tente novamente!'
      });
    }
  },

  create(req, res) {
    return res.render('chefs/create');
  },

  async post(req, res) {
    try {
      let results = await File.create(req.file);
      const { id } = results.rows[0];

      const data = {
        ...req.body,
        fileId: id
      };

      results = await Chef.create(data);
      const chefId = results.rows[0].id;
  
      return res.redirect(`chefs/${chefId}`);
    } catch (err) {
      console.error('ChefsController post',err);

      return res.render('chefs/create', {
        chef: req.body,
        error: 'Erro inisperado, tente novamente!'
      });
    }
  },

  async show(req, res) {
    try {
      let chef = req.chef;

      chef = await getChefImage(chef, req);

      const results = await Chef.findRecipesByChef(chef.id);
      let recipes = results.rows;

      async function getRecipeImage(recipe) {
        const results = await RecipeFile.find(recipe.id);
        const files = results.rows.map(file => ({
          ...file,
          src: `${req.protocol}://${req.headers.host}${file.path.replace('public','')}`
        }))

        return { ...recipe, files: files[0] };
      };

      const recipesFilesPromise = recipes.map(recipe => getRecipeImage(recipe));
      recipes = await Promise.all(recipesFilesPromise);
      
      return res.render('chefs/show', { chef, recipes });
    } catch (err) {
      console.error('ChefsController',err);

      return res.render('chefs/show' , {
        chef,
        recipes,
        error: 'Erro inisperado, tente novamente!'
      });
    }
  },

  async edit(req, res) {
    try {
      let chef = req.chef;
      console.log(chef)

      chef = await getChefImage(chef, req);
    
      return res.render('chefs/edit', { chef });
    } catch (err) {
      console.error('ChefsController edit', err);

      return res.render('chefs/edit', {
        chef,
        error: 'Erro inesperado, tente novamente!'
      });
    }
  },

  async put(req, res) {
    try {
      const removedImage = req.body.removed_images;

      const results = await Chef.find(req.body.id);
      const { file_id } = results.rows[0];
      const oldFileId = file_id;
      
      let data = {
        ...req.body,
        fileId: oldFileId,
      };

      if (req.file) {
        const results = await File.create(req.file);
        const { id } = results.rows[0];
        
        data = {
          ...data,
          fileId: id,
        };
      }

      await Chef.update(data);

      if (removedImage) {
        await File.delete(oldFileId);
      }

      return res.redirect(`/admin/chefs/${req.body.id}`)
    } catch (err) {
      console.error('ChefsController put', err);

      return res.render('chefs/edit', {
        chef: req.body,
        error: 'Erro inesperado, tente novamente!'
      });
    }
  },

  async delete(req, res) {
    try {
      const chefId = req.body.id;

      let results = await Chef.find(chefId);
      let chef = results.rows[0];

      results = await Chef.findRecipesByChef(chefId);
      const recipes = results.rows;

      results = await Chef.find(chefId);
      const fileId = results.rows[0].file_id

      if (recipes == '') {
        await Chef.delete(chefId);

        await File.delete(fileId)
        
        return res.redirect('/admin/chefs');
      }

      chef = await getChefImage(chef, req);

      return res.render('chefs/edit', {
        chef,
        error: 'Esse chefe possui pelo menos uma receita cadastrada! Delete suas receitas antes de tentar novamente.'
      });
    } catch (err) {
      console.error('ChefsController delete', err);

      return res.render('chefs/edit', {
        chef,
        error: 'Error inesperado, tente novamente!'
      });
    }
  }
}