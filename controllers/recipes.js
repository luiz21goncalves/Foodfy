const data = require("../data");

exports.index = function(req ,res) {
  return res.render("admin/index", { recipes: data });
};

exports.create = function(req, res) {
  return res.render("admin/create")
};

exports.show = function(req, res) {
  const { id } = req.params.id;

  return res.render("admin/recipe", { recipe: data[id] });
};

exports.edit = function(req, res) {
  const { id } = req.params.id

  return res.render("admin/edit", { recipe: data[id] })
}
