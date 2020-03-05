const express = require ("express");
const nunjunks = require("nunjucks");

const server =  express();
const recipes = require("./data");

server.use(express.static("public"));

server.set("view engine", "njk");

nunjunks.configure("views", {
  express: server,
  noCache: false,
  autoescape: false,
});

server.get("/", function(req, res) {
  return res.render("index");
});

server.get("/about", function(req, res) {
  return res.render("about")
});

server.get("/recipe", function(req, res) {
  return res.render("recipe")
});

server.listen(5001, function() {
  console.log("server is running")
});