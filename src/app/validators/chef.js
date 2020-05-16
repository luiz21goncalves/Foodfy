const Chef = require('../models/Chef');

async function checkChefs(req, res, next) {
  const chefId = req.params.id;
  const results = await Chef.findOne(chefId);
  const chef = results.rows[0];
  
  if (!chef) return res.render('home/chef', {
    error: 'Chef não encontrado!'
  })

  req.chef = chef;

  next();
};

module.exports = {
  checkChefs,
};