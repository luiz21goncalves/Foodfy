const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const mailer = require('../../lib/mailer');
const User = require('../models/User');
const Recipe = require('../models/Recipe');

module.exports = {
  async list(req, res) {
    const users = await User.all();

    return res.render('user/index', { users });
  },

  create(req, res) {
    return res.render('user/create');
  },

  async post(req, res) {
    try {
      const { name, email, is_admin } = req.body;
      const isAdmin = is_admin === 'on';

      const password = crypto.randomBytes(4).toString('hex');
      const passwordHash = await bcrypt.hash(password, 8);

      const data = { name, email, password: passwordHash, isAdmin };

      await User.create(data);

      await mailer.sendMail({
        to: data.email,
        from: 'no-replay@foodfy.com.br',
        subject: 'Bem-vindo ao  Foodfy',
        html: `
          <h2>${data.name} seja bem-vindo.</h2>
          <p>Seu acesso ao <b>Foodfy</b> está aqui.</p>
          <p>
            Faça seu login <a href="${req.protocol}://localhost:3000/login" target="_blank">clicando aqui</a>.
          </p>
          <p>
            Essa é sua senha <b>${password}</b> de acesso.
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

      return res.render('user/create', {
        user: req.body,
        error: 'Erro inesperado, por favor tente novamente.',
      });
    }
  },

  edit(req, res) {
    const { user } = req;

    return res.render('user/edit', { user });
  },

  async put(req, res) {
    try {
      const { name, email, is_admin, id } = req.body;

      await User.update(id, { name, email, is_admin: Boolean(is_admin) });

      const user = await User.findOne({ where: { id } });

      return res.render('user/edit', {
        user,
        success: `Usuário ${user.name} atualizado com sucesso.`,
      });
    } catch (err) {
      console.error(err);

      return res.render('user/edit', {
        chef: req.body,
        error: 'Erro inesperado, por favor tente novamente.',
      });
    }
  },

  async delete(req, res) {
    const loggedUserId = req.session.userId;
    const { user } = req;

    try {
      const recipes = await User.recipeByUser(user.id);
      await Promise.all(
        recipes.map((recipe) =>
          Recipe.update(recipe.id, { user_id: loggedUserId })
        )
      );

      await User.delete(user.id);

      const users = await User.all();

      return res.render('user/index', {
        users,
        success: `Usuário ${user.name} deletado com sucesso. As receitas que ele criou agora são administradas por você.`,
      });
    } catch (err) {
      console.error(err);

      return res.render('user/index', {
        error: 'Erro inesperado, por favor tente novamente',
      });
    }
  },
};
