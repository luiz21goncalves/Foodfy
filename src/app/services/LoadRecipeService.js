const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');
const RecipeFile = require('../models/RecipeFile');

async function getImage(recipeId) {
  let files = await RecipeFile.findRecipeFilesByRecipeId(recipeId);
  files = files.map((file) => ({
    ...file,
    src: file.path.replace('public', ''),
  }));

  return files;
}

async function format(recipe) {
  const chef = await Chef.find(recipe.chef_id);
  const files = await getImage(recipe.id);

  recipe.img = files[0].src;
  recipe.chef_name = chef.name;
  recipe.files = files;

  return recipe;
}

const LoadService = {
  async load(service, filter) {
    this.filter = filter;

    return await this[service]();
  },

  async recipe() {
    try {
      const recipe = await Recipe.findOne(this.filter);

      return format(recipe);
    } catch (err) {
      console.error(err);
    }
  },

  async recipes() {
    try {
      const recipes = await Recipe.findAll(this.filter);
      const recipesPromise = recipes.map(format);

      return Promise.all(recipesPromise);
    } catch (err) {
      console.error(err);
    }
  },

  format,
};

module.exports = LoadService;
