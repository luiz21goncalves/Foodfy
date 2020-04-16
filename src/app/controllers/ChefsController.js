const Chef = require ("../models/Chef");

module.exports = {
  async index(req, res) {
    const results = await Chef.all();
    const chefs = results.rows;

    return res.render("chefs/index", { chefs });
  },

  create(req, res) {
    return res.render("chefs/create");
  },

  async post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Por favor, preencha todos os dados!")
      }
    }

    const results = await Chef.create(req.body);
    const chefId = results.rows[0].id;

    return res.redirect(`chefs/${chefId}`);
  },

  async show(req, res) {
    let results = await Chef.find(req.params.id);
    const chef = results.rows[0];

    if (!chef) return res.send("Chef não encontrado!");

    results = await Chef.findRecipesByChef(req.params.id);
    const recipes = results.rows;
      
    return res.render("chefs/show", { chef, recipes });
  },

  async edit(req, res) {
    const results = await Chef.find(req.params.id);
    const chef = results.rows[0];

    if (!chef) return res.send("Chef não encontrado!");

    return res.render("chefs/edit", { chef });
  },

  async put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Por favor, preencha todos os dados!")
      }
    }

    await Chef.update(req.body);

    return res.redirect(`/admin/chefs/${req.body.id}`)
  },

  async delete(req, res) {
    const results = Chef.findRecipesByChef(req.params.id);
    const recipes = results.rows;

    if (recipes == "") {
      await Chef.delete(req.body.id);
      
      return res.redirect("/admin/chefs");
    }

    return res.send(`Esse chefe possui pelo menos uma receita cadastrada! Delete suas receitas antes de tentar novamente.`)
  }
}