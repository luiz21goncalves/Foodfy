const Recipe = require('../models/Recipe');
const LoadRecipeService = require('../services/LoadRecipeService');

async function checkAllFields(body) {
  Object.keys(body).map((key) => {
    if (body[key] === '' && key !== 'removed_images' && key !== 'information') {
      return {
        error: 'Apenas o campo de informações adicionas não é obrigatário.',
      };
    }
  });
}

async function show(req, res, next) {
  const recipe = await Recipe.findOne({ where: { id: req.params.id } });

  if (!recipe) {
    const recipes = await LoadRecipeService.load('recipes');

    return res.render('recipe/index', {
      recipes,
      error: 'Receita não encontrada.',
    });
  }

  req.recipe = recipe;

  next();
}

async function edit(req, res, next) {
  const { isAdmin } = req.session;
  const { userId } = req.session;

  let recipe = await Recipe.findOne({ where: { id: req.params.id } });

  if (!recipe) {
    const recipes = await LoadRecipeService.load('recipes');

    return res.render('recipe/index', {
      recipes,
      error: 'Receita não encontrada.',
    });
  }

  if (!isAdmin && userId !== recipe.user_id) {
    recipe = await LoadRecipeService.format(recipe);

    return res.render('recipe/show', {
      recipe,
      error: 'Você não tem permissão para editar ou deletar essa receita.',
    });
  }

  req.recipe = recipe;

  next();
}

async function post(req, res, next) {
  const fillAllFields = await checkAllFields(req.body);

  if (fillAllFields)
    return res.render('recipe/create', {
      ...fillAllFields,
      recipe: req.body,
    });

  if (req.files.length === 0) {
    const chefs = await Recipe.chefSelectionOptions();

    return res.render('recipe/create', {
      chefs,
      recipe: req.body,
    });
  }

  next();
}

async function put(req, res, next) {
  const { isAdmin } = req.session;
  const { userId } = req.session;

  const recipe = await LoadRecipeService.load('recipe', {
    where: { id: req.body.id },
  });

  if (!isAdmin && userId !== req.body.user_id)
    return res.render('recipe/show', {
      recipe,
      error: 'Você não tem permissão para editar ou deletar essa receita.',
    });

  const fillAllFields = await checkAllFields(req.body);

  if (fillAllFields)
    return res.render('recipe/edit', {
      ...fillAllFields,
      recipe: req.body,
    });

  const removedImages = req.body.removed_images.split(',');
  const lastIndex = removedImages.length - 1;
  removedImages.splice(lastIndex, 1);

  if (req.files.length === 0 && removedImages.length >= recipe.files.length) {
    const chefs = await Recipe.chefSelectionOptions();

    return res.render('recipe/edit', {
      error: 'Envie pelo menos uma imagem',
      recipe: req.body,
      chefs,
    });
  }

  next();
}

async function deleteRecipe(req, res, next) {
  const { isAdmin } = req.session;
  const { userId } = req.session;

  let recipe = await Recipe.findOne({ where: { id: req.body.id } });

  if (!isAdmin && userId !== recipe.user_id) {
    recipe = await LoadRecipeService.format(recipe);

    return res.render('recipe/show', {
      recipe,
      error: 'Você não tem permissão para editar ou deletar essa receita.',
    });
  }

  if (!recipe) {
    const recipes = await LoadRecipeService.load('recipes');

    return res.render('recipe/index', {
      recipes,
      error: 'Receita não encontrada.',
    });
  }

  req.recipe = recipe;

  next();
}

module.exports = { show, edit, post, put, deleteRecipe };
