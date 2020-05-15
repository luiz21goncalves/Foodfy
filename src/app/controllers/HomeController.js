const Recipe = require('../models/Recipe');

module.exports = {
  async recipes(req, res) {
    const results = await Recipe.find();
    const recipes = results.rows;
    
    return res.render('home/index', { recipes });
  },
};