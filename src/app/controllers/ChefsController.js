const Chef = require ('../models/Chef');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');

module.exports = {
  async index(req, res) {
    try {
      let results = await Chef.all();
      const chefs = results.rows;

      const chefsFilesPromise = await chefs.map(chef => File.find(chef.file_id));
      results = await Promise.all(chefsFilesPromise);

      let chefsFiles = results.map(result => result.rows[0]);
      chefsFiles = chefsFiles.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
      }));
      
      return res.render('chefs/index', { chefs, chefsFiles });
    } catch (err) {
      console.error('ChefsController index',err);
    }
  },

  create(req, res) {
    return res.render('chefs/create');
  },

  async post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == '' && key != 'removed_images') 
        return res.send('Por favor, preencha todos os dados.')
    }

    if (!req.file)
      return res.send('Por Favor envie uma imagem');

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
    }
  },

  async show(req, res) {
    try {
      const chefId = req.params.id;

      let results = await Chef.find(chefId);
      const chef = results.rows[0];
  
      if (!chef) return res.send('Chef não encontrado!');
  
      results = await Chef.findRecipesByChef(chefId);
      const recipes = results.rows;

      results = await File.find(chef.file_id);
      let chefFile = results.rows[0];
      chefFile = {
        ...chefFile,
        src: `${req.protocol}://${req.headers.host}${chefFile.path.replace('public', '')}`,
      };

      async function getImage(recipeId) {
        const results = await RecipeFile.find(recipeId);
        const files = results.rows.map(file => ({
          ...file,
          src: `${req.protocol}://${req.headers.host}${file.path.replace('public','')}`
        }))

        return files[0];
      }

      const recipesFilesPromise = recipes.map(recipe => getImage(recipe.id));
      const recipesFiles = await Promise.all(recipesFilesPromise);
      
      return res.render('chefs/show', { chef, recipes, chefFile, recipesFiles });
    } catch (err) {
      console.error('ChefsController',err);
    }
  },

  async edit(req, res) {
    try {
      const chefId = req.params.id;

      let results = await Chef.find(chefId);
      const chef = results.rows[0];

      if (!chef) return res.send('Chef não encontrado!');

      results = await File.find(chef.file_id);
      let chefFile = results.rows[0];
      chefFile = {
        ...chefFile,
        src: `${req.protocol}://${req.headers.host}${chefFile.path.replace('public', '')}`,
      };
  
      return res.render('chefs/edit', { chef, chefFile });
    } catch (err) {
      throw new Error(err);
    }
  },

  async put(req, res) {
    const keys = Object.keys(req.body);
    const removedImage = req.body.removed_images;

    for (key of keys) {
      if (req.body[key] == '' && key != 'removed_images') {
        return res.send('Por favor, preencha todos os dados!')
      }
    }

    if (!req.file && removedImage)
      return res.send('Por favor envie uma imagem')

    let newFileID = 0;

    if (req.file) {
      try {
        const results = await File.create(req.file);
        const {id} = results.rows[0];
        
        newFileID = id;
      } catch (err) {
        throw new Error(err);
      }
    }

    const results = await Chef.find(req.body.id);
    const { file_id } = results.rows[0];
    const oldFileId = file_id;
    
    let data = {
      ...req.body,
      fileId: oldFileId,
    };

    if (oldFileId != newFileID && newFileID != 0) {
      data = {
        ...data,
        fileId: newFileID,
      };
    }

    try {
      await Chef.update(data);

      if (removedImage) {
        try {
          await File.delete(oldFileId);
        } catch (err) {
          throw console.log(err);
        }
      }

      return res.redirect(`/admin/chefs/${req.body.id}`)
    } catch (err) {
      throw new Error(err);
    }
  },

  async delete(req, res) {
    try {
      const chefId = req.body.id;

      let results = await Chef.findRecipesByChef(chefId);
      const recipes = results.rows;

      results = await Chef.find(chefId);
      const fileId = results.rows[0].file_id

      if (recipes == '') {
        await Chef.delete(chefId);

        await File.delete(fileId)
        
        return res.redirect('/admin/chefs');
      }
  
      return res.send(`Esse chefe possui pelo menos uma receita cadastrada! Delete suas receitas antes de tentar novamente.`)
    } catch (err) {
      throw new Error(err);
    }
  }
}