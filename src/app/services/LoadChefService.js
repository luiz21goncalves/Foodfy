const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');
const File = require('../models/File');

async function getImage(fileId) {
  const file = await File.find(fileId);

  if (file) file.src = file.path.replace('public', '');

  return file;
}

async function format(chef) {
  const file = await getImage(chef.file_id);

  if (file) {
    chef.img = file.src;
    chef.file = file;
    chef.total = await Recipe.count({ where: { chef_id: chef.id } });
  }

  return chef;
}

const LoadService = {
  async load(service, filter) {
    this.filter = filter;

    return await this[service]();
  },

  async chef() {
    try {
      const chef = await Chef.findOne(this.filter);

      return format(chef);
    } catch (err) {
      console.error(err);
    }
  },

  async chefs() {
    try {
      const chefs = await Chef.findAll(this.filter);
      const chefsPromise = chefs.map(format);

      return Promise.all(chefsPromise);
    } catch (err) {
      console.error(err);
    }
  },

  format,
};

module.exports = LoadService;
