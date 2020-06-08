const { unlinkSync } = require('fs');

const Chef = require('../models/Chef');
const File = require('../models/File');
const Recipe = require('../models/Recipe');
const LoadChefService = require('../services/LoadChefService');
const LoadRecipeService = require('../services/LoadRecipeService');

module.exports = {
  async index(req, res) {
    try {
      const chefs = await LoadChefService.load('chefs');

      // return res.send({ chefs });
      return res.render('chef/index', { chefs });
    } catch (err) {
      console.error(err);
    }
  },

  create(req, res) {
    return res.render('chef/create');
  },

  async show(req, res) {
    let { chef } = req;
    chef = await LoadChefService.format(chef);

    const recipes = await LoadRecipeService.load('recipes', {
      where: { chef_id: chef.id },
    });

    return res.render('chef/show', { chef, recipes });
  },

  async post(req, res) {
    try {
      const [file] = req.files;
      const { name } = req.body;

      const file_id = await File.create({
        name: file.filename,
        original_name: file.originalname,
        path: file.path,
      });

      const chefId = await Chef.create({ name, file_id });

      const chef = await LoadChefService.load('chef', {
        where: { id: chefId },
      });

      return res.render('chef/show', {
        chef,
        success: `O chef ${chef.name} foi criado com sucesso.`,
      });
    } catch (err) {
      console.error('ChefController post', err);
    }
  },

  async edit(req, res) {
    const chef = await LoadChefService.format(req.chef);

    return res.render('chef/edit', { chef });
  },

  async put(req, res) {
    try {
      const removedImges = req.body.removed_images;
      const { id: chefId, file_id: fileId } = req.chef;

      let data = { ...req.body, fileId };

      if (req.files && removedImges) {
        const results = await File.create(...req.files);
        const { id } = results.rows[0];

        data = { ...data, fileId: id };
      }

      await Chef.update(data);

      if (removedImges) await File.delete(removedImges);

      let results = await Chef.findOne(chefId);
      const chef = await getChefImage(results.rows[0], req);

      results = await Chef.findRecipeByChef(chefId);
      const recipesFilesPromise = results.rows.map((recipe) =>
        getRecipeImage(recipe, req)
      );
      const recipes = await Promise.all(recipesFilesPromise);

      return res.render('chef/show', {
        chef,
        recipes,
        success: `O chef ${chef.name} foi atualizado com sucesso.`,
      });
    } catch (err) {
      console.error('ChefController put', err);

      return res.render('chef/edit', {
        error: 'Erro inesperado, tente novamanete.',
        chef: req.body,
      });
    }
  },

  async delete(req, res) {
    try {
      const chef = await LoadChefService.format(req.chef);

      const recipes = await Recipe.findAll({ where: { chef_id: chef.id } });

      if (recipes.length === 0) {
        await Chef.delete({ id: chef.id });
        await File.delete({ id: chef.file_id });
        await unlinkSync(chef.file.path);

        const chefs = await LoadChefService.load('chefs');

        return res.render('chef/index', {
          chefs,
          success: `o chef ${chef.name} deletado com sucesso.`,
        });
      }

      return res.render('chef/edit', {
        chef,
        error:
          'Esse chef não pode ser deletado, pois possui pelo menos receita cadastrada!',
      });
    } catch (err) {
      console.error('ChefController delete', err);
    }
  },
};
