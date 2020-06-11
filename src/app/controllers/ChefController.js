const { unlinkSync } = require('fs');

const Chef = require('../models/Chef');
const File = require('../models/File');
const Recipe = require('../models/Recipe');
const LoadChefService = require('../services/LoadChefService');
const LoadRecipeService = require('../services/LoadRecipeService');

module.exports = {
  async index(req, res) {
    let { limit, page } = req.query;
    const filters = '';
    limit = limit || 16;
    page = page || 1;

    try {
      const { chefs, pagination } = await LoadChefService.paginate({
        limit,
        page,
        filters,
      });

      return res.render('chef/index', { chefs, pagination });
    } catch (err) {
      console.error(err);

      return res.render('chef/index', {
        error: 'Desculpe ocorreu um erro, por favor tente novamente',
      });
    }
  },

  create(req, res) {
    return res.render('chef/create');
  },

  async show(req, res) {
    const { chef } = req;
    let { limit, page } = req.query;

    try {
      const filters = { where: { chef_id: chef.id } };
      limit = limit || 6;
      page = page || 1;

      const formatedChef = await LoadChefService.format(chef);

      const { recipes, pagination } = await LoadRecipeService.paginate({
        limit,
        page,
        filters,
      });

      return res.render('chef/show', {
        chef: formatedChef,
        recipes,
        pagination,
      });
    } catch (err) {
      console.error(err);

      return res.render('chef/show', {
        chef,
        error: 'Desculpe ocorreu um erro, por favor tente novamente',
      });
    }
  },

  async post(req, res) {
    const [file] = req.files;
    const { name } = req.body;

    try {
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
      console.error(err);

      return res.render('chef/create', {
        chef: req.body,
        error: 'Desculpe ocorreu um erro, por favor tente novamente',
      });
    }
  },

  async edit(req, res) {
    const chef = await LoadChefService.format(req.chef);

    return res.render('chef/edit', { chef });
  },

  async put(req, res) {
    const fileIdDeleted = req.body.removed_images;
    const [file] = req.files;
    const { id, file_id, name } = req.body;

    try {
      let data = { file_id, name };

      if (req.files && fileIdDeleted) {
        const fileId = await File.create({
          name: file.filename,
          original_name: file.originalname,
          path: file.path,
        });

        data = { ...data, file_id: fileId };
      }

      await Chef.update(id, data);

      if (fileIdDeleted) {
        const file = await File.findOne({ where: { id: fileIdDeleted } });

        await File.delete(fileIdDeleted);

        unlinkSync(file.path);
      }

      const chef = await LoadChefService.load('chef', { where: { id } });

      const recipes = await LoadRecipeService.load('recipes', {
        where: { chef_id: id },
      });

      return res.render('chef/show', {
        chef,
        recipes,
        success: `O chef ${chef.name} foi atualizado com sucesso.`,
      });
    } catch (err) {
      console.error(err);

      return res.render('chef/edit', {
        chef: req.body,
        error: 'Desculpe ocorreu um erro, por favor tente novamente',
      });
    }
  },

  async delete(req, res) {
    try {
      const chef = await LoadChefService.format(req.chef);

      const recipes = await Recipe.findAll({
        where: { chef_id: chef.id },
      });

      if (recipes.length == 0) {
        await Chef.delete(chef.id);
        await File.delete(chef.file_id);

        unlinkSync(chef.file.path);

        const filters = '';
        const limit = 16;
        const page = 1;

        const { chefs, pagination } = await LoadChefService.paginate({
          limit,
          page,
          filters,
        });

        return res.render('chef/index', {
          chefs,
          pagination,
          success: `o chef ${chef.name} deletado com sucesso.`,
        });
      }

      return res.render('chef/edit', {
        chef,
        error:
          'Esse chef não pode ser deletado, pois possui pelo menos receita cadastrada!',
      });
    } catch (err) {
      console.error(err);

      return res.render('chef/edit', {
        chef: req.chef,
        error: 'Desculpe ocorreu um erro, por favor tente novamente',
      });
    }
  },
};
