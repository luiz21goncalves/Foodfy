const Chef = require('../models/Chef');

async function checkChefs(req, res, next) {
  const results = await Chef.findOne(req.params.id || req.body.id);
  const chef = results.rows[0];
  
  if (!chef) return res.render('chef/index', {
    error: 'Chef não encontrado!'
  })

  req.chef = chef;

  next();
};

module.exports = {
  checkChefs,
};