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

  async paginate({ limit, page, filters }) {
    const offset = Math.ceil(limit * (page - 1));

    const totalChefs = await Chef.paginate({ filters, limit, offset });

    const chefs = await Promise.all(totalChefs.map(this.format));

    const count = await Chef.count(filters);

    const pagination = { total: Math.ceil(count / limit), page };

    return { chefs, pagination };
  },

  format,
};

module.exports = LoadService;
