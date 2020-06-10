const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const mailer = require('../../lib/mailer');
const User = require('../models/User');

module.exports = {
  async index(req, res) {
    let { limit, page } = req.query;
    const filters = '';
    limit = limit || 9;
    page = page || 1;
    const offset = Math.ceil(limit * (page - 1));

    const users = await User.paginate({ filters, offset, limit });

    const count = await User.count();

    const pagination = { total: Math.ceil(count / limit), page };

    return res.render('user/index', { users, pagination });
  },

  create(req, res) {
    return res.render('user/create');
  },

  async post(req, res) {
    try {
      const { name, email, is_admin } = req.body;
      const isAdmin = !!is_admin;

      const password = crypto.randomBytes(4).toString('hex');
      const passwordHash = await bcrypt.hash(password, 8);

      await User.create({
        name,
        email,
        password: passwordHash,
        is_admin: isAdmin,
      });

      await mailer.sendMail({
        to: email,
        from: 'no-replay@foodfy.com.br',
        subject: 'Bem-vindo ao  Foodfy',
        html: `
          <h2>${name} seja bem-vindo.</h2>
          <p>Seu acesso ao <b>Foodfy</b> está aqui.</p>
          <p>
            Faça seu login <a href="${req.protocol}://localhost:3000/login" target="_blank">clicando aqui</a>.
          </p>
          <p>
            Essa é sua senha <b>${password}</b> de acesso.
          </p>
        `,
      });

      const users = await User.findAll();

      return res.render('user/index', {
        users,
        success: `Usuário ${name} criado com sucesso.`,
      });
    } catch (err) {
      console.error(err);
    }
  },

  edit(req, res) {
    const { user } = req;

    return res.render('user/edit', { user });
  },

  async put(req, res) {
    try {
      const { name, email, is_admin, id } = req.body;
      const isAdmin = !!is_admin;

      await User.update(id, { name, email, is_admin: isAdmin });

      const user = await User.findOne({ where: { id } });

      return res.render('user/edit', {
        user,
        success: `Usuário ${user.name} atualizado com sucesso.`,
      });
    } catch (err) {
      console.error(err);
    }
  },

  async delete(req, res) {
    const { user } = req;

    try {
      await User.delete(user.id);

      const filters = '';
      const limit = 9;
      const page = 1;
      const offset = 0;

      const users = await User.paginate({ filters, offset, limit });

      const count = await User.count();

      const pagination = { total: Math.ceil(count / limit), page };

      return res.render('user/index', {
        users,
        pagination,
        success: `Usuário ${user.name} deletado com sucesso.`,
      });
    } catch (err) {
      console.error(err);
    }
  },
};
