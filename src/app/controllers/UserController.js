const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const mailer = require('../../lib/mailer');
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

      // const token = crypto.randomBytes(20).toString('hex');
      // let now = new Date();
      // now = now.setHours(now.getHours() + 1);

      // const data = { name, email, password: passwordHash, isAdmin, token, now };
      const data = { name, email, password: passwordHash, isAdmin };
  
      await User.create(data);

      await mailer.sendMail({
        to: data.email,
        from: 'no-replay@foodfy.com.br',
        subject: 'Bem-vindo ao  Foodfy',
        html:`
          <h2>${data.name} seja bem-vindo.</h2>
          <p>Seu acesso ao <b>Foodfy</b> está aqui.</p>
          <p>
            Faça seu login <a href="${req.protocol}://localhost:3000/session/login" target="_blank">clicando aqui</a>
          </p>
          <p>
            Essa é sua senha <b>${password}</b>, mas relaxa é só para o primeiro acesso.
          </p>
        `,
      });

      const users = await User.all();
  
      return res.render('user/index', {
        users,
        success: `Usuário ${data.name} criado com sucesso.`,
      });
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

  async delete(req, res) {
    try{
      const user = req.user;
      await User.delete(user.id);

      const users = await User.all();

      return res.render('user/index', {
        users,
        success: `Usuário ${user.name} deletado com sucesso`,
      });
    } catch (err) {
      console.error(err);

      return res.render('user/index', {
        users,
        error: 'Erro inesperado, por favor tente novamente'
      });
    }
  },
};