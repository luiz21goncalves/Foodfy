const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = require('../models/User');

module.exports = {
  index(req, res) {
    return res.render('user/index');
  },

  create(req, res) {
    return res.render('user/create');
  },

  async post(req, res) {
    try {
      const { name, email, is_admin } = req.body;
      const isAdmin = is_admin == 'on' ? true : false;
  
      const password = crypto.randomBytes(4).toString('hex');
      const passwordHash = await bcrypt.hash(password, 8);
  
      const data = { name, email, password: passwordHash, isAdmin };
  
      const user = await User.create(data);
  
      console.log(user.id)
      return res.send(user.id);
    } catch (err) {
      console.error(err);

      return  res.render('user/create', {
        user: req.body,
        error: 'Erro inesperado, por favor tente novamente.'
      })
    }
  },
};