const { unlinkSync } = require('fs');

const Recipe = require('../models/Recipe');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');
const LoadRecipeService = require('../services/LoadRecipeService');

module.exports = {
  async index(req, res) {
    try {
      let { limit, page } = req.query;
      const filters = '';
      limit = limit || 12;
      page = page || 1;

      const { recipes, pagination } = await LoadRecipeService.paginate({
        limit,
        page,
        filters,
      });

      return res.render('recipe/index', { recipes, pagination });
    } catch (err) {
      console.error(err);

      return res.render('recipe/index', {
        error: 'Desculpe ocorreu um erro, por favor tente novamente',
      });
    }
  },

  async create(req, res) {
    try {
      const chefs = await Recipe.chefSelectionOptions();

      return res.render('recipe/create', { chefs });
    } catch (err) {
      console.error(err);

      return res.render('recipe/create', {
        error: 'Desculpe ocorreu um erro, por favor tente novamente',
      });
    }
  },

  async post(req, res) {
    const { title, chef_id, ingredients, preparation, information } = req.body;

    const { files } = req;

    try {
      const recipeId = await Recipe.create({
        user_id: req.session.userId,
        chef_id,
        title,
        ingredients,
        preparation,
        information,
      });

      const filesIds = await Promise.all(
        files.map((file) =>
          File.create({
            name: file.filename,
            path: file.path,
            original_name: file.originalname,
          })
        )
      );

      await Promise.all(
        filesIds.map((id) =>
          RecipeFile.create({ file_id: id, recipe_id: recipeId })
        )
      );

      const recipe = await LoadRecipeService.load('recipe', {
        where: { id: recipeId },
      });

      return res.render('recipe/show', {
        recipe,
        success: `A receita ${recipe.title} foi criada com sucesso.`,
      });
    } catch (err) {
      console.error(err);

      return res.render('recipe/create', {
        recipe: req.body,
        error: 'Desculpe ocorreu um erro, por favor tente novamente',
      });
    }
  },

  async show(req, res) {
    let { recipe } = req;

    try {
      recipe = await LoadRecipeService.format(recipe);

      return res.render('recipe/show', { recipe });
    } catch (err) {
      console.error('RecipeController show', err);

      return res.render('recipe/show', {
        recipe,
        error: 'Desculpe ocorreu um erro, por favor tente novamente',
      });
    }
  },

  async edit(req, res) {
    try {
      const recipe = await LoadRecipeService.format(req.recipe);

      const chefs = await Recipe.chefSelectionOptions();

      return res.render('recipe/edit', { recipe, chefs });
    } catch (err) {
      console.error(err);

      return res.render('recipe/edit', {
        recipe: req.recipe,
        error: 'Desculpe ocorreu um erro, por favor tente novamente',
      });
    }
  },

  async put(req, res) {
    const {
      id,
      title,
      chef_id,
      ingredients,
      preparation,
      information,
    } = req.body;

    const { files } = req;

    try {
      if (req.body.removed_images) {
        const filesId = req.body.removed_images.split(',');
        const lastIndex = filesId.length - 1;
        filesId.splice(lastIndex, 1);

        const recipeFiles = await Promise.all(
          filesId.map((file_id) => RecipeFile.findOne({ where: { file_id } }))
        );

        await Promise.all(
          recipeFiles.map((item) => RecipeFile.delete(item.id))
        );

        const files = await Promise.all(
          filesId.map((id) => File.findOne({ where: { id } }))
        );

        await Promise.all(filesId.map((id) => File.delete(id)));

        files.map((file) => unlinkSync(file.path));
      }

      if (files != 0) {
        const filesIds = await Promise.all(
          files.map((file) =>
            File.create({
              name: file.filename,
              path: file.path,
              original_name: file.originalname,
            })
          )
        );

        await Promise.all(
          filesIds.map((file_id) =>
            RecipeFile.create({ file_id, recipe_id: id })
          )
        );
      }

      await Recipe.update(id, {
        title,
        chef_id,
        ingredients,
        preparation,
        information,
      });

      const recipe = await LoadRecipeService.load('recipe', { where: { id } });

      return res.render('recipe/show', {
        recipe,
        success: `A receita ${recipe.title} foi atualizada com sucesso.`,
      });
    } catch (err) {
      console.error(err);

      return res.render('recipe/edit', {
        recipe: req.body,
        error: 'Desculpe ocorreu um erro, por favor tente novamente',
      });
    }
  },

  async delete(req, res) {
    try {
      const recipe = await LoadRecipeService.format(req.recipe);

      const recipeFiles = await RecipeFile.findAll({
        where: { recipe_id: recipe.id },
      });

      await Promise.all(recipeFiles.map((item) => RecipeFile.delete(item.id)));

      await Recipe.delete(recipe.id);

      await Promise.all(recipe.files.map((file) => File.delete(file.id)));

      recipe.files.map((file) => unlinkSync(file.path));

      const filters = '';
      const limit = 12;
      const page = 1;

      const { recipes, pagination } = await LoadRecipeService.paginate({
        limit,
        page,
        filters,
      });

      return res.render('recipe/index', {
        recipes,
        pagination,
        success: `A receita ${recipe.title} deletada com sucesso.`,
      });
    } catch (err) {
      console.error(err);

      return res.render('recipe/edit', {
        recipe: req.recipe,
        error: 'Desculpe ocorreu um erro, por favor tente novamente',
      });
    }
  },
};
