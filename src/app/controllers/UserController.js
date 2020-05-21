const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = require('../models/User');

module.exports = {
  async list(req, res) {
    const users = await User.all()

    return res.render('user/index', { users });
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
  
      return res.send(user.id);
    } catch (err) {
      console.error(err);

      return  res.render('user/create', {
        user: req.body,
        error: 'Erro inesperado, por favor tente novamente.'
      })
    }
  },

  edit(req, res) {
    const user = req.user;

    return res.render('user/edit', { user });
  },

  async put(req, res) {
    try {
      const { name, email, is_admin, id } = req.body;
      const isAdmin = is_admin == 'on' ? true : false;

      const data = { name, email, isAdmin, id };

      await User.update(data);

      const user = await User.findOne({ where: { id: data.id } })

      return res.render('user/edit', {
        user,
        success: `Usuário ${user.name} atualizado com sucesso.`
      });
    } catch (err) {
      console.error(err);

      return res.render('user/edit', {
        chef: data,
        error: 'Erro inesperado, por favor tente novamente.'
      })
    }
  },

};