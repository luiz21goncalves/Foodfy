const express = require ("express");
const nunjunks = require("nunjucks");

const server =  express();
const recipes = require("./data");

server.use(express.static("public"));

server.set("view engine", "njk");

nunjunks.configure("views", {
  express: server,
  autoescape: false,
  noCache: false
});

server.get("/", function(req, res) {
  return res.render("index" , { recipes });
});

server.get("/about", function(req, res) {
  return res.render("about");
});

server.get("/recipe/:index", function(req, res) {
  const recipeIndex = req.params.index;
  const recipe = recipes[recipeIndex];

  return res.render("recipe", { recipe });
});

server.listen(5000, function() {
  console.log("server is running")
});