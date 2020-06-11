const LoadChefService = require('../services/LoadChefService');
const LoadRecipeService = require('../services/LoadRecipeService');

module.exports = {
  async index(req, res) {
    let { limit, page } = req.query;
    const filters = '';
    limit = limit || 6;
    page = page || 1;

    try {
      const { recipes, pagination } = await LoadRecipeService.paginate({
        limit,
        page,
        filters,
      });

      return res.render('home/index', { recipes, pagination });
    } catch (err) {
      console.error(err);

      return res.render('home/index', {
        error: 'Desculpe ocorreu um erro, por favor tente novamente',
      });
    }
  },

  async recipe(req, res) {
    let { recipe } = req;

    try {
      recipe = await LoadRecipeService.format(recipe);

      return res.render('home/recipe', { recipe });
    } catch (err) {
      console.error(err);

      return res.render('home/index', {
        recipe,
        error: 'Desculpe ocorreu um erro, por favor tente novamente',
      });
    }
  },

  async search(req, res) {
    let { filter, limit, page } = req.query;
    limit = limit || 12;
    page = page || 1;

    if (!filter || filter.toLowerCase() == 'todas as receitas') filter = null;

    try {
      const { recipes, pagination } = await LoadRecipeService.search({
        limit,
        page,
        filter,
      });

      return res.render('home/search', {
        filter: filter || 'Todas as Receitas',
        recipes,
        pagination,
      });
    } catch (err) {
      console.error(err);

      return res.render('home/search', {
        error: 'Desculpe ocorreu um erro, por favor tente novamente',
      });
    }
  },

  async chefs(req, res) {
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

      return res.render('home/chef', { chefs, pagination });
    } catch (err) {
      console.error(err);

      return res.render('home/chef', {
        error: 'Desculpe ocorreu um erro, por favor tente novamente',
      });
    }
  },

  async chefShow(req, res) {
    const { chef } = req;
    let { limit, page } = req.query;

    const filters = { where: { chef_id: chef.id } };
    limit = limit || 6;
    page = page || 1;

    try {
      const formatedChef = await LoadChefService.format(chef);

      const { recipes, pagination } = await LoadRecipeService.paginate({
        limit,
        page,
        filters,
      });

      return res.render('home/recipes-chefs', {
        chef: formatedChef,
        recipes,
        pagination,
      });
    } catch (err) {
      console.error(err);

      return res.render('home/recipes-chefs', {
        chef,
        error: 'Desculpe ocorreu um erro, por favor tente novamente',
      });
    }
  },

  about(req, res) {
    return res.render('home/about');
  },
};
