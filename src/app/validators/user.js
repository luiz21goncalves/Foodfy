function post(req, res, next) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == '' && key != 'is_admin')
      return res.render('user/create', {
        user: req.body,
        error: 'Apenas o campo de admistrador não é obrigatório.'
      });
  }

  next();
};

module.exports = {
  post,
};