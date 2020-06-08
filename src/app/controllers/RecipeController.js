const { unlinkSync } = require('fs');

const Recipe = require('../models/Recipe');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');
const LoadRecipeService = require('../services/LoadRecipeService');

module.exports = {
  async index(req, res) {
    try {
      const recipes = await LoadRecipeService.load('recipes');

      return res.render('recipe/index', { recipes });
    } catch (err) {
      console.error('RecipeController index', err);

      return res.render('recipe/index');
    }
  },

  async create(req, res) {
    try {
      const chefs = await Recipe.chefSelectionOptions();

      return res.render('recipe/create', { chefs });
    } catch (err) {
      console.error('RecipeController create', err);

      return res.render('recipe/edit');
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

      const filesPromise = files.map((file) =>
        File.create({
          name: file.filename,
          path: file.path,
          original_name: file.originalname,
        })
      );
      const filesIds = await Promise.all(filesPromise);

      const recipeFilesPromise = filesIds.map((id) =>
        RecipeFile.create({ file_id: id, recipe_id: recipeId })
      );
      await Promise.all(recipeFilesPromise);

      const recipe = await LoadRecipeService.load('recipe', {
        where: { id: recipeId },
      });

      return res.render('recipe/show', {
        recipe,
        success: `A receita ${recipe.title} foi criada com sucesso.`,
      });
    } catch (err) {
      console.error('RecipeController post', err);
    }
  },

  async show(req, res) {
    try {
      let { recipe } = req;
      recipe = await LoadRecipeService.format(recipe);

      return res.render('recipe/show', { recipe });
    } catch (err) {
      console.error('RecipeController show', err);

      return res.render('recipe/show');
    }
  },

  async edit(req, res) {
    const recipe = await LoadRecipeService.format(req.recipe);

    const chefs = await Recipe.chefSelectionOptions();

    return res.render('recipe/edit', { recipe, chefs });
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

        const recipeFilesDeletePromise = filesId.map((file_id) =>
          RecipeFile.delete({ file_id })
        );
        await Promise.all(recipeFilesDeletePromise);

        const filesDeletePromise = filesId.map((id) => File.delete({ id }));
        await Promise.all(filesDeletePromise);
      }

      if (files != 0) {
        const filesPormise = files.map((file) =>
          File.create({ name: file.filename, path: file.path })
        );
        const filesIds = await Promise.all(filesPormise);

        const recipeFilesPromise = filesIds.map((file_id) =>
          RecipeFile.create({ file_id, recipe: id })
        );
        await Promise.all(recipeFilesPromise);
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
      console.error('RecipeController put', err);
    }
  },

  async delete(req, res) {
    try {
      let { recipe } = req;

      recipe = await LoadRecipeService.format(recipe);

      await Promise.all(
        recipe.files.map((file) => File.delete({ id: file.id }))
      );

      await RecipeFile.delete({ recipe_id: recipe.id });

      await Recipe.delete({ id: recipe.id });

      await Promise.all(recipe.files.map((file) => unlinkSync(file.path)));

      const recipes = await LoadRecipeService.load('recipes');

      return res.render('recipe/index', {
        recipes,
        success: `A receita ${recipe.title} deletada com sucesso.`,
      });
    } catch (err) {
      console.error('RecipeController delete', err);
    }
  },
};
