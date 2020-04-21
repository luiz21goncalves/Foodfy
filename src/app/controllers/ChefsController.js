const Chef = require ('../models/Chef');
const File = require('../models/File');

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
      throw new Error(err);
    }
  },

  create(req, res) {
    return res.render('chefs/create');
  },

  async post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == '') 
        return res.send('Por favor, preencha todos os dados.')
    }

    try {
      let results = await File.create(req.file);
      const fileId = results.rows[0];

      const data = {
        ...req.body,
        fileId: fileId.id
      };

      results = await Chef.create(data);
      const chefId = results.rows[0].id;
  
      return res.redirect(`chefs/${chefId}`);
    } catch (err) {
      throw new Error(err);
    }
  },

  async show(req, res) {
    try {
      let results = await Chef.find(req.params.id);
      const chef = results.rows[0];
  
      if (!chef) return res.send('Chef não encontrado!');
  
      results = await Chef.findRecipesByChef(req.params.id);
      const recipes = results.rows;

      results = await File.find(chef.file_id);
      const chefsFiles = results.rows
        
      return res.send({ chef, recipes, chefFile });
      return res.render('chefs/show', { chef, recipes, chefFile });
    } catch (err) {
      throw new Error(err);
    }
  },

  async edit(req, res) {
    try {
      const results = await Chef.find(req.params.id);
      const chef = results.rows[0];
  
      if (!chef) return res.send('Chef não encontrado!');
  
      return res.render('chefs/edit', { chef });
    } catch (err) {
      throw new Error(err);
    }
  },

  async put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == '') {
        return res.send('Por favor, preencha todos os dados!')
      }
    }

    try {
      await Chef.update(req.body);

      return res.redirect(`/admin/chefs/${req.body.id}`)
    } catch (err) {
      throw new Error(err);
    }
  },

  async delete(req, res) {
    try {
      const results = Chef.findRecipesByChef(req.params.id);
      const recipes = results.rows;
  
      if (recipes == '') {
        await Chef.delete(req.body.id);
        
        return res.redirect('/admin/chefs');
      }
  
      return res.send(`Esse chefe possui pelo menos uma receita cadastrada! Delete suas receitas antes de tentar novamente.`)
    } catch (err) {
      throw new Error(err);
    }
  }
}